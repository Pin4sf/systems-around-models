import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const expectedProductionDocuments = [
  "server/app/_not-found.html",
  "server/app/architectures.html",
  "server/app/fieldbook/the-model-is-not-the-agent.html",
  "server/app/index.html",
  "server/pages/404.html",
];

function attributeValue(tag, name) {
  const match = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>` + "`" + `]+))`, "i").exec(tag);
  return match ? (match[1] ?? match[2] ?? match[3]).toLowerCase() : undefined;
}

function isScriptLoadLink(tag) {
  const rel = attributeValue(tag, "rel")?.split(/\s+/) ?? [];
  return rel.includes("modulepreload") || (rel.includes("preload") && attributeValue(tag, "as") === "script");
}

function isJsonLdScript(attributes) {
  return attributeValue(attributes, "type") === "application/ld+json" && attributeValue(attributes, "src") === undefined;
}

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const filename = path.join(directory, entry.name);
    if (entry.isDirectory()) return htmlFiles(filename);
    return entry.isFile() && entry.name.endsWith(".html") ? [filename] : [];
  }));
  return nested.flat();
}

export async function stripStaticClientScripts(buildDirectory = ".next") {
  const buildRoot = path.resolve(buildDirectory);
  const files = (await htmlFiles(buildRoot)).sort();
  if (files.length === 0) throw new Error("No production HTML documents found; refusing to report a zero-JavaScript build.");
  const relativeFiles = new Set(files.map((filename) => path.relative(buildRoot, filename).split(path.sep).join("/")));
  const missing = expectedProductionDocuments.filter((filename) => !relativeFiles.has(filename));
  if (missing.length > 0) {
    throw new Error(`Missing expected production HTML: ${missing.join(", ")}`);
  }
  let scriptsRemoved = 0;
  await Promise.all(files.map(async (filename) => {
    const source = await readFile(filename, "utf8");
    const jsonLdBlocks = [];
    const protectedJsonLd = source.replace(
      /<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi,
      (tag, attributes) => {
        const jsonLd = isJsonLdScript(attributes);
        if (!jsonLd) return tag;
        const marker = `SYSTEMS_AROUND_MODELS_JSON_LD_${jsonLdBlocks.length}`;
        jsonLdBlocks.push(tag);
        return marker;
      },
    );
    const withoutScriptPreloads = protectedJsonLd.replace(/<link\b[^>]*(?:>|$)/gi, (tag) => {
      if (!isScriptLoadLink(tag)) return tag;
      scriptsRemoved += 1;
      return "";
    });
    let stripped = withoutScriptPreloads.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, () => {
      scriptsRemoved += 1;
      return "";
    });
    stripped = stripped.replace(/<script\b[^>]*(?:>|$)/gi, () => {
      scriptsRemoved += 1;
      return "";
    });
    for (const [index, block] of jsonLdBlocks.entries()) {
      stripped = stripped.replace(`SYSTEMS_AROUND_MODELS_JSON_LD_${index}`, block);
    }
    const executableRemainder = stripped.replace(
      /<script\b([^>]*)>[\s\S]*?<\/script\s*>/gi,
      (tag, attributes) => isJsonLdScript(attributes) ? "" : tag,
    );
    const remainingScript = /<script\b/i.test(executableRemainder);
    const remainingScriptPreload = [...executableRemainder.matchAll(/<link\b[^>]*(?:>|$)/gi)]
      .some(([tag]) => isScriptLoadLink(tag));
    if (remainingScript || remainingScriptPreload) {
      throw new Error(`Executable script markup remains after transformation in ${path.relative(buildRoot, filename)}`);
    }
    if (stripped !== source) await writeFile(filename, stripped);
  }));
  return { filesChanged: files.length, scriptsRemoved };
}

function cliBuildDirectory(arguments_) {
  const index = arguments_.indexOf("--build-dir");
  if (index === -1) return ".next";
  if (!arguments_[index + 1]) throw new Error("--build-dir requires a directory");
  return arguments_[index + 1];
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  try {
    const result = await stripStaticClientScripts(cliBuildDirectory(process.argv.slice(2)));
    process.stdout.write(
      `Static client scripts removed (${result.scriptsRemoved} tags across ${result.filesChanged} HTML files).\n`,
    );
  } catch (error) {
    process.stderr.write(`Static client script removal failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
