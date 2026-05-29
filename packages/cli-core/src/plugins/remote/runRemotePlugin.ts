import { downloadTemplate } from "giget";
import type { Lang, RemotePluginConfig, pluginContext } from "./types/index.js";
import {
  applyTsMorphInjection,
  resolveTemplateFile,
} from "./applyTsMorphInjection.js";
const TEMPLATE_REPO = "arpitbhatia23/exon-cli";
import os from "os";
import path from "path";
import fs from "fs-extra";
import { generateDockerCompose } from "./generateDockerCompose.js";
import { outro } from "@clack/prompts";
function getLang(context: pluginContext): Lang {
  return context.language === "TypeScript" ? "ts" : "js";
}

export async function runRemotePlugin(
  config: RemotePluginConfig,
  context: pluginContext,
) {
  const lang = getLang(context);
  const tempDir = path.join(os.tmpdir(), "exon-plugin");
  const targetDir = context.targetDir ?? process.cwd();

  const res = await downloadTemplate(
    `github:${TEMPLATE_REPO}/templates/${config.templatePath}/${lang}`,
    {
      dir: tempDir,
      force: true,
    },
  );

  for (const file of config?.asset || []) {
    const src = path.join(
      tempDir,
      resolveTemplateFile(file.source, context.language),
    );
    const dest = path.join(
      targetDir,
      resolveTemplateFile(file.destination, context.language),
    );
    if (await fs.pathExists(src)) {
      await fs.copy(src, dest, { overwrite: file.overwrite });
    }
    if (config.generate?.includes("docker-compose")) {
      await generateDockerCompose(targetDir, context);
    }
  }
  for (const injection of config.inject ?? []) {
    const resolvedInjection = {
      ...injection,
      file: resolveTemplateFile(injection.file, context?.language),
    };

    await applyTsMorphInjection(resolvedInjection, targetDir, context);
  }
  await fs.remove(tempDir);
  outro(`✅ Applied plugin: ${config.name}`);
}
