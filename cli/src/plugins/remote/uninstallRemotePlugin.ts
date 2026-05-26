import { execSync } from "node:child_process";
import type { pluginContext, RemotePluginConfig } from "./types/index.ts";
import {
  removeImportInjection,
  removeStatementInjection,
} from "./applyTsMorphInjection.js";

function buildPackageNames(deps?: Record<string, string>): string {
  return Object.keys(deps ?? {}).join(" ");
}

function runCommand(command: string, cwd: string) {
  execSync(command, {
    cwd,
    stdio: "inherit",
  });
}

export async function uninstallRemotePlugin(
  config: RemotePluginConfig,
  context: pluginContext,
) {
  const targetDir = context.targetDir ?? process.cwd();

  const dependencies = buildPackageNames(config.dependencies);
  const devDependencies = buildPackageNames(config.devDependencies);
  const packages = [dependencies, devDependencies].filter(Boolean).join(" ");

  if (packages) {
    runCommand(`pnpm remove ${packages}`, targetDir);
  }

  for (const removeImport of config.uninstall?.removeImports ?? []) {
    await removeImportInjection(removeImport, targetDir);
  }

  for (const removeStatement of config.uninstall?.removeStatements ?? []) {
    await removeStatementInjection(removeStatement, targetDir);
  }

  console.log(`✅ Removed plugin: ${config.name}`);
}
