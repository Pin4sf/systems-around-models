import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

export async function checkBundleBudget({ buildDirectory, routeHtml, limit }) {
  const root = path.resolve(buildDirectory);
  const htmlPath = path.resolve(root, routeHtml);
  if (!htmlPath.startsWith(`${root}${path.sep}`)) throw new Error("Route HTML must remain inside build directory");
  const html = await readFile(htmlPath, "utf8");
  const assetUrls = [...new Set(
    [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+\.js(?:\?[^"']*)?)["'][^>]*>/gi)]
      .map((match) => match[1].split("?")[0])
      .filter((url) => url.startsWith("/_next/")),
  )].sort();
  const assets = await Promise.all(assetUrls.map(async (url) => {
    const filename = path.resolve(root, url.slice("/_next/".length));
    if (!filename.startsWith(`${root}${path.sep}`)) throw new Error(`Invalid JavaScript asset ${url}`);
    const contents = await readFile(filename);
    return { url, gzipBytes: gzipSync(contents, { level: 9, mtime: 0 }).byteLength };
  }));
  const totalGzipBytes = assets.reduce((total, asset) => total + asset.gzipBytes, 0);
  if (totalGzipBytes > limit) {
    throw new Error(
      `Representative route uses ${totalGzipBytes} gzip bytes across ${assets.length} unique JavaScript assets; exceeds ${limit} byte budget.`,
    );
  }
  return { assets, totalGzipBytes };
}

function cliOptions(arguments_) {
  const valueAfter = (flag, fallback) => {
    const index = arguments_.indexOf(flag);
    if (index === -1) return fallback;
    if (!arguments_[index + 1]) throw new Error(`${flag} requires a value`);
    return arguments_[index + 1];
  };
  return {
    buildDirectory: valueAfter("--build-dir", ".next"),
    routeHtml: valueAfter("--route-html", "server/app/fieldbook/the-model-is-not-the-agent.html"),
    limit: Number(valueAfter("--limit", "120000")),
  };
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  try {
    const result = await checkBundleBudget(cliOptions(process.argv.slice(2)));
    process.stdout.write(
      `Bundle budget passed: ${result.assets.length} unique JavaScript assets, ${result.totalGzipBytes} gzip bytes.\n`,
    );
  } catch (error) {
    process.stderr.write(`Bundle budget failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
