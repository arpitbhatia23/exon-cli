#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import path from "path";
import pkg from "../package.json" with { type: "json" };
import fs from "fs";
import { cancel, intro, spinner } from "@clack/prompts";
import {
  copyTemplate,
  installdependencies,
  selectDatabase,
  selectLanguage,
} from "@exon-cli/core";

import { createProjectConfig } from "@exon-cli/core";
import { addcommand } from "./commands/addCommand.js";
import { removeCommand } from "./commands/removeCommand.js";
import type { Plugin, pluginContext } from "@exon-cli/core";
import { loadPlugins, plugins } from "@exon-cli/core";
import { runPlugins } from "@exon-cli/core";
import { selectPackageManger } from "@exon-cli/core";
const program = new Command();
program.addCommand(addcommand);
program.addCommand(removeCommand);
/* This part of the code is setting up the configuration for the CLI program using the `Command` class
from the `commander` package. Here's a breakdown of what it's doing: */
program
  .name("exon-cli")
  .description("⚡ Generate production-ready Express.js APIs in seconds")
  .version(pkg.version, "-v, --version", "output the current version")
  .addHelpText(
    "after",
    `
Examples:
  $ exon-cli create my-api           # Create project interactively
  $ exon-cli create blog-backend -t   # Create with TypeScript
  $ exon-cli create shop-api -j -m    # Create with JS and Mongoose
  $ exon-cli create crm -t -p -D      # Create with TS, Prisma, and Docker enabled
  $ exon-cli create app -t -d         # Create with TS and Drizzle ORM
  $ exon-cli create api -t --pnpm     # Create with TS and pnpm
  $ exon-cli create backend -t -p --yarn  # Create with TS, Prisma, and yarn

Docs:
  https://www.npmjs.com/package/exon-cli

🚀 exon-cli just saved you 30 minutes of setup!

Star the repo to support the project: https://github.com/arpitbhatia23/exon-cli
`,
  );

console.log(
  chalk.yellow(figlet.textSync("EXON-CLI", { horizontalLayout: "full" })),
);

program
  .command("create <name>")
  .description("create a new express project")
  .option("--ts, -t", "use TypeScript")
  .option("--js, -j", "use JavaScript")
  .option("--mongoose, -m", "use Mongoose ODM")
  .option("--prisma, -p", "use Prisma ORM")
  .option("--drizzle, -d", "use Drizzle ORM")
  .option("--npm", "use npm as package manager")
  .option("--pnpm", "use pnpm as package manager")
  .option("--yarn", "use yarn as package manager")
  .option("--bun", "use bun as package manager")
  .option("--docker, -D", "enable Docker support")
  .option("--logger, -L", "enable Morgan & Winston logging")
  .option("--swagger, -S", "enable Swagger API documentation")
  .action(async (name: string, options) => {
    intro(chalk.cyan("EXON → Initializing project...."));

    const s = spinner({ indicator: "dots" });

    try {
      const targetDir = path.resolve(process.cwd(), name);
      if (fs.existsSync(targetDir)) {
        cancel(
          ` A folder named "${name}" already exists.\n` +
            `Please choose a different project name.`,
        );
        process.exit(1);
      }
      let packageManger = await selectPackageManger(options);
      let language: "TypeScript" | "JavaScript" = await selectLanguage(options);
      let database: string = await selectDatabase(options);

      await copyTemplate(language, name, targetDir, s);

      const context: pluginContext = {
        language,
        projectName: name,
        targetDir,
        packageManger: packageManger,
        database,
        options,
      };

      const appliedPlugins: string[] = [];
      for (const plugin of plugins) {
        if (plugin.shouldRun(context)) {
          await runPlugins(plugin, context, { force: true });
          appliedPlugins.push(plugin.name);
        }
      }
      await createProjectConfig(targetDir, {
        language,
        database,
        packageManger: packageManger,
        plugins: appliedPlugins,
      });

      const pkgPath = path.join(targetDir, "package.json");
      await installdependencies(s, pkgPath, targetDir, packageManger);
    } catch (error) {
      if (error) {
        console.log(error);
        cancel("\n👋 Project creation cancelled by user.");
        process.exit(0); // Exit cleanly
      }
    }
  });
await program.parseAsync(process.argv);
