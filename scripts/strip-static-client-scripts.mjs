import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
  const appDirectory = path.join(path.resolve(buildDirectory), "server", "app");
  const files = await htmlFiles(appDirectory);
  let scriptsRemoved = 0;
  await Promise.all(files.map(async (filename) => {
    const source = await readFile(filename, "utf8");
    const withoutScriptPreloads = source.replace(/<link\b[^>]*>/gi, (tag) => {
      const scriptPreload = /\brel=["']preload["']/i.test(tag) && /\bas=["']script["']/i.test(tag);
      if (!scriptPreload) return tag;
      scriptsRemoved += 1;
      return "";
    });
    const stripped = withoutScriptPreloads.replace(
      /<script\b([^>]*)>[\s\S]*?<\/script>/gi,
      (tag, attributes) => {
        if (/\btype=["']application\/ld\+json["']/i.test(attributes)) return tag;
        scriptsRemoved += 1;
        return "";
      },
    );
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
