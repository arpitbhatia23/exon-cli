import { downloadTemplate } from "giget";
import type { Lang, RemotePluginConfig, pluginContext } from "./types/index.ts";
import { applyTsMorphInjection } from "./applyTsMorphInjection.js";
const TEMPLATE_REPO = "https://github.com/arpitbhatia23/exon-cli";

function getLang(context: pluginContext): Lang {
  return context.language === "TypeScript" ? "ts" : "js";
}

export async function runRemotePlugin(
  config: RemotePluginConfig,
  context: pluginContext,
) {
  const lang = getLang(context);
  const targetDir = context.targetDir ?? process.cwd();
  await downloadTemplate(
    `github:${TEMPLATE_REPO}/${config.templatePath}/${lang}`,
    {
      dir: targetDir,
      force: true,
    },
  );

  for (const injection of config.inject ?? []) {
    await applyTsMorphInjection(injection, targetDir);
  }

  console.log(`✅ Applied plugin: ${config.name}`);
}
