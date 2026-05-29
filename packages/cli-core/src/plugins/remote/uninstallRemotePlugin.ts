import { execSync } from "node:child_process";
import type { pluginContext, RemotePluginConfig } from "./types/index.js";
import {
  removeImportInjection,
  removeStatementInjection,
  replaceCallInjection,
  replaceExportInjection,
  replaceImportInjection,
  resolveTemplateFile,
} from "./applyTsMorphInjection.js";
import fs from "fs";
import { outro } from "@clack/prompts";
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

  config.files?.forEach((file) => {
    const filePath = resolveTemplateFile(file, context.language);
    fs.rmSync(filePath, {
      force: true,
    });
  });

  for (const removeImport of config.uninstall?.removeImports ?? []) {
    const resolvedInjection = {
      ...removeImport,
      file: resolveTemplateFile(removeImport.file, context?.language),
    };

    await removeImportInjection(resolvedInjection, targetDir, context);
  }

  for (const removeStatement of config.uninstall?.removeStatements ?? []) {
    const resolvedInjection = {
      ...removeStatement,
      file: resolveTemplateFile(removeStatement.file, context?.language),
    };
    await removeStatementInjection(resolvedInjection, targetDir);
  }

  for (const replaceCall of config.uninstall?.replaceCalls ?? []) {
    await replaceCallInjection(replaceCall, targetDir, context);
  }

  for (const replaceExport of config.uninstall?.replaceExports ?? []) {
    await replaceExportInjection(replaceExport, targetDir, context);
  }
  for (const replaceImport of config.uninstall?.replaceImport ?? []) {
    await replaceImportInjection(replaceImport, targetDir, context);
  }
  outro(`✅ Removed plugin: ${config.name}`);
}
