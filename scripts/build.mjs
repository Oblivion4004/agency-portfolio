import { cp, mkdir, readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const destination = path.join(root, "dist");
await mkdir(destination, { recursive: true });
for (const entry of ["index.html", "src", "assets", "robots.txt"]) {
  await cp(path.join(root, entry), path.join(destination, entry), {
    recursive: true,
  });
}
const html = await readFile(path.join(destination, "index.html"), "utf8");
const localReferences = [
  ...html.matchAll(/(?:src|href)="((?:assets|src)\/[^"#]+)"/g),
];
for (const [, reference] of localReferences) {
  await stat(path.join(destination, reference));
}
console.log(
  `Built dist/ and verified ${localReferences.length} local asset references.`,
);
