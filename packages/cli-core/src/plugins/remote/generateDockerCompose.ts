import YAML from "yaml";
import path from "path";
import fs from "fs-extra";
import type { pluginContext } from "./types/index.js";

export async function generateDockerCompose(
  targetDir: string,
  context: pluginContext,
) {
  const database = context.options?.database ?? context.database;

  const services: Record<string, any> = {
    server: {
      build: ".",
      container_name: "exon-server",
      ports: ["3802:3802"],
      env_file: [".env"],
      networks: ["exon-net"],
      restart: "unless-stopped",
    },
  };

  const volumes: Record<string, null> = {};

  if (database === "Mongoose") {
    services.mongo = {
      image: "mongo:7",
      container_name: "exon-mongo",
      ports: ["27017:27017"],
      volumes: ["mongo_data:/data/db"],
      networks: ["exon-net"],
      restart: "unless-stopped",
    };

    services.server.depends_on = ["mongo"];
    volumes.mongo_data = null;
  }

  if (database === "Prisma" || database === "Drizzle") {
    services.postgres = {
      image: "postgres:16",
      container_name: "exon-postgres",
      environment: {
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres",
        POSTGRES_DB: "exon",
      },
      ports: ["5432:5432"],
      volumes: ["postgres_data:/var/lib/postgresql/data"],
      networks: ["exon-net"],
      restart: "unless-stopped",
    };

    services.server.depends_on = ["postgres"];
    volumes.postgres_data = null;
  }

  const compose = {
    version: "3.9",
    services,
    networks: {
      "exon-net": {
        driver: "bridge",
      },
    },
    volumes,
  };

  await fs.writeFile(
    path.join(targetDir, "docker-compose.yml"),
    YAML.stringify(compose),
  );
}
