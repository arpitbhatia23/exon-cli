import type {
  Plugin,
  RemotePluginConfig,
  pluginContext,
} from "./types/index.js";
import { installRemotePlugin } from "./installRemotePlugin.js";
import { uninstallRemotePlugin } from "./uninstallRemotePlugin.js";
import { runRemotePlugin } from "./runRemotePlugin.js";

type PluginCondition = {
  field: string;
  truthy?: boolean;
  equals?: unknown;
};

function getValueByPath(obj: unknown, path: string) {
  return path.split(".").reduce<any>((acc, key) => acc?.[key], obj);
}

export function createRemotePlugin(config: RemotePluginConfig): Plugin {
  return {
    name: config.name,
    type: config.type,
    files: config.files ?? [],

    shouldRun(context: pluginContext) {
      if (context.database === config.condition?.[0]?.equals) return true;
      if (config.name === "mongoose") console.log(context, config.condition);
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
