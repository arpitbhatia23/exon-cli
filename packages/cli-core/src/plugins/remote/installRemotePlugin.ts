import { execSync } from "node:child_process";
import type { pluginContext, RemotePluginConfig } from "./types/index.js";
import { outro } from "@clack/prompts";
import { PackageManager } from "../../types/options.js";

const addCommands: Record<PackageManager, string> = {
  npm: "npm install",
  pnpm: "pnpm add",
  yarn: "yarn add",
  bun: "bun add",
} as const;
function buildPackages(deps?: Record<string, string>): string {
  return Object.entries(deps ?? {})
    .map(([pkg, version]) => `${pkg}@${version}`)
    .join(" ");
}

function runCommand(command: string, cwd: string) {
  execSync(command, {
    cwd,
    stdio: "ignore",
  });
}

export async function installRemotePlugin(
  config: RemotePluginConfig,
  context: pluginContext,
) {
  const targetDir = context.targetDir ?? process.cwd();
  const packageManger = context?.packageManger;

  const dependencies = buildPackages(config.dependencies);
  const devDependencies = buildPackages(config.devDependencies);
  if (dependencies) {
    runCommand(`${addCommands[packageManger]} ${dependencies}`, targetDir);
  }

  if (devDependencies) {
    runCommand(`pnpm add -D ${devDependencies}`, targetDir);
  }

  outro(`✅ Installed dependencies for ${config.name}`);
}
