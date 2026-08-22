import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

export async function generateSocialCard(root = process.cwd()) {
  const repositoryRoot = path.resolve(root);
  const source = path.join(repositoryRoot, "assets", "social", "systems-around-models.svg");
  const output = path.join(repositoryRoot, "public", "social", "systems-around-models.png");
  await mkdir(path.dirname(output), { recursive: true });
  await sharp(await readFile(source), { density: 144 })
    .resize(1200, 630, { fit: "fill" })
    .png({ compressionLevel: 9, adaptiveFiltering: false, palette: true, quality: 100 })
    .toFile(output);
  return output;
}

const isCli = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isCli) {
  try {
    const output = await generateSocialCard();
    process.stdout.write(`Social card generated: ${path.relative(process.cwd(), output)}\n`);
  } catch (error) {
    process.stderr.write(`Social card generation failed: ${error.message}\n`);
    process.exitCode = 1;
  }
}
