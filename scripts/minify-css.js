const fs = require("fs/promises");
const path = require("path");
const CleanCSS = require("clean-css");

async function main() {
  const inputPath = path.resolve("css/style.css");
  const outputPath = path.resolve("css/style.min.css");
  const css = await fs.readFile(inputPath, "utf8");

  const result = new CleanCSS({
    level: 2,
    format: "keep-breaks",
  }).minify(css);

  if (result.errors && result.errors.length > 0) {
    throw new Error(result.errors.join("\n"));
  }

  await fs.writeFile(outputPath, result.styles, "utf8");
  process.stdout.write(`OK ${outputPath}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
