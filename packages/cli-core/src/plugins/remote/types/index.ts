import { PackageManager } from "../../../types/options";

export type RemotePluginConfig = {
  name: string;
  type: Plugin["type"];
  condition?: {
    field: string;
    equals?: unknown;
    truthy?: boolean;
  }[];
  files?: string[];
  templatePath: string;
  inject?: any[];
  asset?: {
    source: string;

    destination: string;
    overwrite: boolean;
  }[];
  uninstall?: {
    removeImports?: any[];
    removeStatements?: any[];
    replaceCalls?: any[];
    replaceExports?: any[];
    replaceImport?: any[];
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  generate?: "docker-compose"[];
};

export interface Plugin {
  name: string;
  shouldRun(context: pluginContext): boolean;
  type: PluginType;
  run(context: pluginContext): Promise<void>;
  install?(context: pluginContext): Promise<void>;
  uninstall?(context: pluginContext): Promise<void>;
  files?: string[];
}
export interface pluginContext {
  projectName: string;
  language: "TypeScript" | "JavaScript";
  targetDir: string;
  database?: string;
  packageManger: PackageManager;
  options?: {
    docker?: string;
    logger?: string;
    swagger?: string;
    socket?: string;
    database?: string;
  };
}
export type PluginType = "database" | "feature" | "deployment";

export type Lang = "ts" | "js";

export type RemotePluginCondition = {
  field: string; // example: "options.swagger"
  equals?: unknown;
  truthy?: boolean;
};

export type RemoteImportInjection = {
  type: "import";
  file: string;
  moduleSpecifier: string;
  defaultImport?: string;
  namedImports?: string[];
};

export type RemoteStatementInjection = {
  type: "statement";
  file: string;
  after?: string;
  before?: string;
  code: string;
};

export type RemoteReplaceCallInjection = {
  type: "replaceCall";
  file: string;
  target: string; // example: "app.listen"
  replaceWith: string;
};

export type RemoteReplaceExport = {
  type: "replaceExport";
  file: string;
  from: string;
  to: string;
};
export type RemoteInjection =
  | RemoteImportInjection
  | RemoteStatementInjection
  | RemoteReplaceCallInjection
  | RemoteReplaceExport
  | RemoteReplaceImport;

export type RemoteRemoveImport = {
  file: string;
  moduleSpecifier: string;
  defaultImport?: string;
  namedImports?: string[];
};

export type RemoteRemoveStatement = {
  file: string;
  code: string;
};
export type RemoteReplaceImport = {
  type: "replaceImport";
  file: string;
  moduleSpecifier: string;
  from: string;
  to: string;
};
