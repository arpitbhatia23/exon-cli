import { cancel, isCancel, outro, select } from "@clack/prompts";
import { DB_OPTIONS, LANG_OPTION } from "./types/options.js";
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import color from "picocolors";
import { downloadTemplate } from "giget";
import { registry } from "./plugins/registry.js";
import type { Registry } from "./plugins/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type langType = {
  ts?: "TypeScript";
  js?: "JavaScript";
};

export const selectLanguage = async (
  options: langType,
): Promise<"TypeScript" | "JavaScript"> => {
  if (options.ts && options.js) {
    cancel("❌ Choose either --ts or --js, not both.");
    process.exit(1);
  }

  if (options.js) return "JavaScript";
  if (options.ts) return "TypeScript";

  const selected = await select({
    message: "Which language do you want to use?",
    options: LANG_OPTION,
  });

  if (isCancel(selected)) {
    cancel("Project creation cancelled.");
    process.exit(0);
  }

  return selected as "TypeScript" | "JavaScript";
};

type dbTypes = {
  mongoose?: string;
  prisma?: string;
  drizzle?: string;
  none?: string;
};
export const selectDatabase = async (options: dbTypes): Promise<string> => {
  const dbKeys: (keyof dbTypes)[] = ["mongoose", "prisma", "drizzle"];

  // Filter only selected DB flags
  const dbFlags: (keyof dbTypes)[] = dbKeys.filter((key) =>
    Boolean(options[key]),
  );

  if (dbFlags.length > 1) {
    cancel("❌ Choose only one database option.");
    process.exit(1);
  }

  // Return selected database if a flag is set
  if (options.mongoose) return "Mongoose";
  if (options.prisma) return "Prisma";
  if (options.drizzle) return "Drizzle";

  // Otherwise, prompt user interactively
  const selected = await select({
    message: "Which database ORM do you want to use?",
    options: DB_OPTIONS,
  });

  if (isCancel(selected)) {
    cancel("Project creation cancelled.");
    process.exit(0);
  }

  return selected as string;
};

export const copyTemplate = async (
  language: string,
  name: string,
  targetDir: string,
  s: any,
): Promise<void> => {
  const registerTemplate = (await registry()) as Registry;
  const templateKey =
    language === "TypeScript"
      ? "node-express-template-ts"
      : "node-express-template-js";

  const template = registerTemplate.templates?.[templateKey];
  if (!template) {
    cancel("Template not found");
  }
  try {
    s.start("Downloading template from GitHub...");
    const result = await downloadTemplate(
      `github:${template?.repo}/${template?.path}`,
      {
        dir: targetDir,
        force: true,
      },
    );
    s.stop("Project structure created");
  } catch (error) {
    s.stop("Failed to create project structure", 1);
    cancel("Template download failed!");
  }

  if (!fs.existsSync(targetDir)) {
    cancel(`Something went wrong while creating ${targetDir}`);
  }
};

export const installdependencies = async (
  s: any,
  pkgPath: string,
  targetDir: string,
): Promise<void> => {
  if (fs.existsSync(pkgPath)) {
    s.start("Installing dependencies...");

    try {
      await new Promise<void>((resolve, reject) => {
        const child = spawn("npm", ["install", "--loglevel=error"], {
          cwd: targetDir,
          stdio: "ignore",
          shell: true,
        });

        child.on("close", (code) => {
          if (code !== 0) reject(new Error("Install failed"));
          else resolve();
        });
      });

      s.stop("Dependencies installed successfully!");
    } catch (err) {
      s.stop("Failed to install dependencies.", 1);
      process.exit(1);
    }
  }
  outro(
    color.green(`🚀 exon-cli just saved you 30 minutes of setup!`) +
      "\n" +
      color.dim(`Star the repo to support the project: `) +
      color.cyan(color.underline("https://github.com/arpitbhatia23/exon")),
  );
};
