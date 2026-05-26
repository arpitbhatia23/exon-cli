import { registry } from "./registry.js";
import { createRemotePlugin } from "./remote/createRemotePlugin.js";
import type { RemotePluginConfig } from "./remote/types/index.js";

type Registry = {
  plugins: Record<string, RemotePluginConfig>;
};

export async function loadPlugins() {
  const registerPlugins = (await registry()) as Registry;

  return Object.values(registerPlugins.plugins).map((config) =>
    createRemotePlugin(config),
  );
}

export const plugins = await loadPlugins();
