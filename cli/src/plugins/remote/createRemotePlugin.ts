import type {
  Plugin,
  RemotePluginConfig,
  pluginContext,
} from "./types/index.js";
import { installRemotePlugin } from "./installRemotePlugin.js";
import { uninstallRemotePlugin } from "./uninstallRemotePlugin.js";
import { runRemotePlugin } from "./runRemotePlugin.js";
export function createRemotePlugin(config: RemotePluginConfig): Plugin {
  return {
    name: config.name,
    type: config.type,
    files: config.files ?? [],

    shouldRun(context: pluginContext) {
      if (!config.condition) return true;

      const value = config.condition.field
        .split(".")
        .reduce<any>((obj, key) => obj?.[key], context);

      if (config.condition.truthy) return Boolean(value);
      if ("equals" in config.condition)
        return value === config.condition.equals;

      return false;
    },

    async run(context) {
      await runRemotePlugin(config, context);
    },

    async install(context) {
      await installRemotePlugin(config, context);
    },

    async uninstall(context) {
      await uninstallRemotePlugin(config, context);
    },
  };
}
