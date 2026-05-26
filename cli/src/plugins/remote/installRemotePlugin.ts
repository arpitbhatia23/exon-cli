import { execSync } from "node:child_process";
import type { Lang, pluginContext, RemotePluginConfig } from "./types/index.js";

function getLang(context: pluginContext): Lang {
  return context.language === "TypeScript" ? "ts" : "js";
}

function buildPackages(deps?: Record<string, string>): string {
  return Object.entries(deps ?? {})
    .map(([pkg, version]) => `${pkg}@${version}`)
    .join(" ");
}

function runCommand(command: string, cwd: string) {
  execSync(command, {
    cwd,
    stdio: "inherit",
  });
}

export async function installRemotePlugin(
  config: RemotePluginConfig,
  context: pluginContext,
) {
  const targetDir = context.targetDir ?? process.cwd();

  const dependencies = buildPackages(config.dependencies);
  const devDependencies = buildPackages(config.devDependencies);

  if (dependencies) {
    runCommand(`pnpm add ${dependencies}`, targetDir);
  }

  if (devDependencies) {
    runCommand(`pnpm add -D ${devDependencies}`, targetDir);
  }

  console.log(`✅ Installed dependencies for ${config.name}`);
}
