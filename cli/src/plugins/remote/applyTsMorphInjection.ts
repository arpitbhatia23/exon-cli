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
} from "./types/index.js";

function createProject(targetDir: string) {
  const tsconfigPath = path.join(targetDir, "tsconfig.json");

  return new Project({
    skipAddingFilesFromTsConfig: true,
  });
}

function resolveFile(targetDir: string, file: string) {
  return path.resolve(targetDir, file);
}

async function saveSourceFile(project: Project, filePath: string) {
  const sourceFile = project.addSourceFileAtPath(filePath);
  await sourceFile.save();
}

export async function applyTsMorphInjection(
  injection: RemoteInjection,
  targetDir: string,
) {
  if (injection.type === "import") {
    return addImportInjection(injection, targetDir);
  }

  if (injection.type === "statement") {
    return addStatementInjection(injection, targetDir);
  }

  if (injection.type === "replaceCall") {
    return replaceCallInjection(injection, targetDir);
  }
}

export async function addImportInjection(
  injection: RemoteImportInjection,
  targetDir: string,
) {
  const filePath = resolveFile(targetDir, injection.file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${injection.file}`);
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
    moduleSpecifier: injection.moduleSpecifier,
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
) {
  const filePath = resolveFile(targetDir, injection.file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${injection.file}`);
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
) {
  const filePath = resolveFile(targetDir, injection.file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠️ File not found: ${injection.file}`);
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const calls = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);

  const targetCall = calls.find((call) => {
    return call.getExpression().getText() === injection.target;
  });

  if (!targetCall) {
    console.log(`⚠️ Call not found: ${injection.target}`);
    return;
  }

  const statement = targetCall.getFirstAncestorByKind(
    SyntaxKind.ExpressionStatement,
  );
  if (!statement) {
    console.log(`⚠️ Statement not found for: ${injection.target}`);
    return;
  }

  statement.replaceWithText(injection.replaceWith);

  await sourceFile.save();
}

export async function removeImportInjection(
  injection: RemoteRemoveImport,
  targetDir: string,
) {
  const filePath = resolveFile(targetDir, injection.file);

  if (!fs.existsSync(filePath)) {
    return;
  }

  const project = createProject(targetDir);
  const sourceFile = project.addSourceFileAtPath(filePath);

  const importDecl = sourceFile.getImportDeclaration(
    (i) => i.getModuleSpecifierValue() === injection.moduleSpecifier,
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
