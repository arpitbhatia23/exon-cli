import { registry } from "./registry.js";
import { createRemotePlugin } from "./remote/createRemotePlugin.js";
import type { RemotePluginConfig } from "./remote/types/index.js";

export interface TemplateConfig {
  repo: string;
  path: string;
  branch?: string;
  description?: string;
}

export interface Registry {
  plugins?: Record<string, RemotePluginConfig>;
  templates?: Record<string, TemplateConfig>;
}
export async function loadPlugins() {
  const registerPlugins = (await registry()) as Registry;

  return Object.values(registerPlugins.plugins ?? {}).map((config) =>
    createRemotePlugin(config),
  );
}

export const plugins = await loadPlugins();
console.log(plugins);
