export const docsOrigin = "https://exon-cli-docs.vercel.app";

export const pageMetadata: Record<
  string,
  { title: string; description: string }
> = {
  home: {
    title: "Exon CLI Documentation | Express.js API Generator",
    description:
      "Official Exon CLI documentation. Create Express.js APIs with TypeScript or JavaScript, add Prisma, Mongoose, Drizzle, Swagger, logging, Socket.IO, and Docker.",
  },
  introduction: {
    title: "Introduction | Exon CLI Documentation",
    description:
      "Learn what Exon CLI generates, how its plugin architecture works, and which JavaScript, TypeScript, database, and API tools it supports.",
  },
  "getting-started": {
    title: "Quick Start | Exon CLI Documentation",
    description:
      "Install Exon CLI and scaffold a production-ready Express.js API with your choice of language, database, and plugins.",
  },
  "cli-commands": {
    title: "CLI Commands | Exon CLI Documentation",
    description:
      "Reference for Exon CLI create, add, and remove commands, including language, ORM, Swagger, logger, and Docker options.",
  },
  "plugin-architecture": {
    title: "Plugin System | Exon CLI Documentation",
    description:
      "Understand the Exon CLI plugin registry, file templates, dependencies, and code injection lifecycle.",
  },
  "plugins-reference": {
    title: "Plugins Reference | Exon CLI Documentation",
    description:
      "Explore Exon CLI plugins for Swagger API docs, logging, and Socket.IO, including their installed dependencies.",
  },
  "database-orms": {
    title: "Databases and ORMs | Exon CLI Documentation",
    description:
      "Compare Prisma, Mongoose, and Drizzle integrations available when scaffolding an Express.js API with Exon CLI.",
  },
  "docker-deployment": {
    title: "Docker Deployment | Exon CLI Documentation",
    description:
      "Configure Docker and Compose support for Exon CLI projects, including container builds and database services.",
  },
  "best-practices": {
    title: "Best Practices | Exon CLI Documentation",
    description:
      "Recommended project structure, environment variable handling, and routing conventions for Exon CLI APIs.",
  },
};

export const getPageFromPath = (pathname: string) => {
  const match = pathname.match(/^\/docs\/([^/]+)\/?$/);
  return match && pageMetadata[match[1]] ? match[1] : "home";
};

export const getPagePath = (pageId: string) =>
  pageId === "home" ? "/" : `/docs/${pageId}/`;
