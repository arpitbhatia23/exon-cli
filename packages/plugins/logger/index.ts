import path from "path";
import type { Plugin } from "../types/index.js";
import { ROOT_DIR } from "../../core/rootRes.js";
import { injectLogger } from "./injectLogger.js";
import { execSync } from "node:child_process";
import fs from "fs-extra";
import { removeImport, removeStatement } from "@cli/utils";

export const loggerPlugin: Plugin = {
  name: "logger",
  type: "feature",
  shouldRun(context) {
    return !!context.options?.logger;
  },
  files: [
    "src/middleware/morgan.middleware.ts",
    "src/middleware/morgan.middleware.js",
    "src/utils/logger.ts",
    "src/utils/logger.js",
  ],
  async run(context) {
    await injectLogger(context);
  },
  async install(context) {
    const templatedir = path.resolve(
      ROOT_DIR,
      "plugins/templates/logger",
      context.language === "TypeScript" ? "ts" : "js",
    );

    const data = JSON.parse(
      fs.readFileSync(path.join(templatedir, "deps.json"), "utf-8"),
    );
    if (!data) {
      console.log("deps not found");
      return;
    }
    const deps = data?.dependencies;
    const packages = Object.entries(deps)
      .map(([pkg, ver]) => `${pkg}@${ver}`)
      .join(" ");

    if (!packages) {
      console.log("no dependencies found in file");
    }

    try {
      execSync(`npm install ${packages}`, { stdio: "ignore" });
    } catch (error) {
      console.log(error);
    }
  },
  async uninstall(context) {
    const loggerDir = path.resolve(
      ROOT_DIR,
      "plugins/templates/logger",
      context.language === "TypeScript" ? "ts" : "js",
    );

    const depsPath = path.join(loggerDir, "deps.json");

    if (fs.existsSync(depsPath)) {
      const data = JSON.parse(fs.readFileSync(depsPath, "utf-8"));
      const deps = data?.dependencies || {};

      const packages = Object.keys(deps).join(" ");

      if (packages) {
        execSync(`npm uninstall ${packages}`, {
          cwd: context.targetDir,
          stdio: "inherit",
        });
      }
    }

    const isTS = context.language === "TypeScript";
    const ext = isTS ? "ts" : "js";

    const appPath = path.join(context.targetDir, `src/app.${ext}`);

    const asyncHandlerPath = path.join(
      context.targetDir,
      `src/utils/asyncHandler.${ext}`,
    );

    await removeImport(asyncHandlerPath, {
      defaultImport: "logger",
      moduleSpecifier: `./logger${ext === "js" ? ".js" : ""}`,
    });
    await removeStatement(asyncHandlerPath, "logger.error(error);");
    await removeImport(appPath, {
      moduleSpecifier: `./middleware/morgan.middleware${ext === "js" ? ".js" : ""}`,
      defaultImport: "morganLogger",
    });

    await removeStatement(appPath, `app.use(morganLogger);`);
  },
};
