import { execSync } from "node:child_process";
import type { pluginContext, RemotePluginConfig } from "./types/index.js";
import { outro } from "@clack/prompts";

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

  outro(`✅ Installed dependencies for ${config.name}`);
}
