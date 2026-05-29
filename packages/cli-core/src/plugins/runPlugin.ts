import type { Plugin, pluginContext } from "./remote/types/index.js";

export const runPlugins = async (
  plugins: Plugin[] | Plugin,
  context: pluginContext,
  options?: {
    force?: boolean;
  },
): Promise<void> => {
  const pluginList = Array.isArray(plugins) ? plugins : [plugins];

  for (const plugin of pluginList) {
    const shouldExecute = options?.force || plugin.shouldRun(context);
    if (!shouldExecute) {
      continue;
    }

    await plugin.run(context);
    if (plugin.install) await plugin.install(context);
  }
};
