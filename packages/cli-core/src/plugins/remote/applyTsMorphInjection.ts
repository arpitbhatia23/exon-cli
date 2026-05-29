import path from "node:path";
import fs from "fs-extra";
import {
  Project,
  SyntaxKind,
  type OptionalKind,
  type ImportDeclarationStructure,
} from "ts-morph";
import type {
  RemoteInjection,
  RemoteImportInjection,
  RemoteRemoveImport,
  RemoteRemoveStatement,
  RemoteStatementInjection,
  pluginContext,
  RemoteReplaceExport,
} from "./types/index.js";
import { cancel } from "@clack/prompts";

function createProject(targetDir: string) {
  const tsconfigPath = path.join(targetDir, "tsconfig.json");

  return new Project({
    skipAddingFilesFromTsConfig: true,
  });
}

function resolveFile(targetDir: string, file: string) {
  return path.resolve(targetDir, file);
}

export async function applyTsMorphInjection(
  injection: RemoteInjection,
  targetDir: string,
  context: pluginContext,
) {
  if (injection.type === "import") {
    return addImportInjection(injection, targetDir, context);
  }

  if (injection.type === "statement") {
    return addStatementInjection(injection, targetDir, context);
  }

  if (injection.type === "replaceCall") {
    return replaceCallInjection(injection, targetDir, context);
  }
  if (injection.type === "replaceExport") {
    return replaceExportInjection(injection, targetDir, context);
  }
  if (injection.type === "replaceImport") {
    return replaceImportInjection(injection, targetDir, context);
  }
}

export async function addImportInjection(
  injection: RemoteImportInjection,
  targetDir: string,
  context: pluginContext,
) {
  const filePath = resolveFile(
    targetDir,
    resolveTemplateFile(injection.file, context.language),
  );

  if (!fs.existsSync(filePath)) {
    cancel(`⚠️ File not found: ${injection.file}`);
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const existingImport = sourceFile.getImportDeclaration(
    (i) => i.getModuleSpecifierValue() === injection.moduleSpecifier,
  );

  if (existingImport) {
    if (injection.defaultImport && !existingImport.getDefaultImport()) {
      existingImport.setDefaultImport(injection.defaultImport);
    }

    const existingNamed = existingImport
      .getNamedImports()
      .map((n) => n.getName());

    for (const name of injection.namedImports ?? []) {
      if (!existingNamed.includes(name)) {
        existingImport.addNamedImport(name);
      }
    }

    await sourceFile.save();
    return;
  }

  const importConfig: OptionalKind<ImportDeclarationStructure> = {
    moduleSpecifier: resolveImportSpecifier(
      injection.moduleSpecifier,
      context.language,
    ),
  };

  if (injection.defaultImport) {
    importConfig.defaultImport = injection.defaultImport;
  }

  if (injection.namedImports?.length) {
    importConfig.namedImports = injection.namedImports;
  }

  sourceFile.addImportDeclaration(importConfig);

  await sourceFile.save();
}

export async function addStatementInjection(
  injection: RemoteStatementInjection,
  targetDir: string,
  context: pluginContext,
) {
  const filePath = resolveFile(
    targetDir,
    resolveTemplateFile(injection.file, context.language),
  );

  if (!fs.existsSync(filePath)) {
    cancel(`⚠️ File not found: ${injection.file}`);
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);
  const content = sourceFile.getFullText();

  if (content.includes(injection.code)) {
    return;
  }

  if (injection.after && content.includes(injection.after)) {
    const updated = content.replace(
      injection.after,
      `${injection.after}\n${injection.code}`,
    );

    sourceFile.replaceWithText(updated);
    await sourceFile.save();
    return;
  }

  if (injection.before && content.includes(injection.before)) {
    const updated = content.replace(
      injection.before,
      `${injection.code}\n${injection.before}`,
    );

    sourceFile.replaceWithText(updated);
    await sourceFile.save();
    return;
  }

  sourceFile.addStatements(injection.code);
  await sourceFile.save();
}

export async function replaceCallInjection(
  injection: Extract<RemoteInjection, { type: "replaceCall" }>,
  targetDir: string,
  context: pluginContext,
) {
  const filePath = resolveFile(
    targetDir,
    resolveTemplateFile(injection.file, context.language),
  );

  if (!fs.existsSync(filePath)) {
    cancel(`⚠️ File not found: ${injection.file}`);
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
  const targetCall = calls.find((call) => {
    return call.getExpression().getText() === injection.target;
  });

  if (!targetCall) {
    cancel(`⚠️ Call not found: ${injection.target}`);
    return;
  }

  targetCall.getExpression().replaceWithText(injection.replaceWith);
  await sourceFile.save();
}

export async function removeImportInjection(
  injection: RemoteRemoveImport,
  targetDir: string,
  Context: pluginContext,
) {
  const filePath = resolveFile(targetDir, injection.file);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const importDecl = sourceFile.getImportDeclaration(
    (i) =>
      i.getModuleSpecifierValue() ===
      resolveImportSpecifier(injection.moduleSpecifier, Context.language),
  );

  if (!importDecl) {
    return;
  }

  if (injection.defaultImport && importDecl.getDefaultImport()?.getText()) {
    importDecl.removeDefaultImport();
  }

  for (const name of injection.namedImports ?? []) {
    const namedImport = importDecl.getNamedImports().find((n) => {
      return n.getName() === name;
    });

    namedImport?.remove();
  }

  const hasDefault = Boolean(importDecl.getDefaultImport());
  const hasNamed = importDecl.getNamedImports().length > 0;
  const hasNamespace = Boolean(importDecl.getNamespaceImport());

  if (!hasDefault && !hasNamed && !hasNamespace) {
    importDecl.remove();
  }

  await sourceFile.save();
}

export async function removeStatementInjection(
  injection: RemoteRemoveStatement,
  targetDir: string,
) {
  const filePath = resolveFile(targetDir, injection.file);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const content = sourceFile.getFullText();

  if (!content.includes(injection.code)) {
    return;
  }

  sourceFile.replaceWithText(content.replace(injection.code, ""));

  await sourceFile.save();
}
export async function replaceImportInjection(
  injection: Extract<RemoteInjection, { type: "replaceImport" }>,
  targetDir: string,
  context: pluginContext,
) {
  const filePath = resolveFile(
    targetDir,
    resolveTemplateFile(injection.file, context.language),
  );

  if (!fs.existsSync(filePath)) {
    cancel(`⚠️ File not found: ${injection.file}`);
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const importDecl = sourceFile.getImportDeclaration((decl) => {
    return (
      decl.getModuleSpecifierValue() ===
      resolveImportSpecifier(injection.moduleSpecifier, context.language)
    );
  });

  if (!importDecl) return;

  const namedImport = importDecl.getNamedImports().find((named) => {
    return named.getName() === injection.from;
  });
  if (!namedImport) return;

  namedImport.replaceWithText(injection.to);

  await sourceFile.save();
}
export async function replaceExportInjection(
  injection: Extract<RemoteInjection, { type: "replaceExport" }>,
  targetDir: string,
  context: pluginContext,
) {
  const filePath = resolveFile(
    targetDir,
    resolveTemplateFile(injection.file, context.language),
  );

  if (!fs.existsSync(filePath)) {
    cancel(`⚠️ File not found: ${injection.file}`);
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const fromName = injection.from.trim();
  const toName = injection.to.trim();

  const exportDecl = sourceFile.getExportDeclaration((decl) => {
    return decl.getNamedExports().some((namedExport) => {
      return namedExport.getName() === fromName;
    });
  });

  if (!exportDecl) {
    cancel(`⚠️ Export not found: ${fromName}`);
    return;
  }

  const namedExport = exportDecl.getNamedExports().find((namedExport) => {
    return namedExport.getName() === fromName;
  });

  if (!namedExport) return;

  namedExport.replaceWithText(toName);

  await sourceFile.save();
}
export function resolveTemplateFile(
  file: string,
  language: "TypeScript" | "JavaScript",
) {
  const ext = language === "TypeScript" ? "ts" : "js";
  return file.replaceAll("{ext}", ext);
}

export function resolveImportSpecifier(
  specifier: string,
  language: "TypeScript" | "JavaScript",
) {
  const ext = language === "TypeScript" ? "js" : "js";
  return specifier.replaceAll("{ext}", ext);
}
