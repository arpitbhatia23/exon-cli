import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

let resolvedRootDir = "";
try {
  // Try to resolve relative to exon-cli package
  const cliPkgPath = require.resolve("exon-cli/package.json");
  resolvedRootDir = path.dirname(cliPkgPath);
} catch (e) {
  // Fallback
  resolvedRootDir = path.resolve(process.cwd());
}

export const ROOT_DIR = resolvedRootDir;
