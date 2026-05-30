# ⚡ Exon CLI: The Ultimate Express.js Generator & TypeScript Scaffolding Tool

[![npm version](https://img.shields.io/npm/v/exon-cli.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/exon-cli)
[![npm downloads](https://img.shields.io/npm/dm/exon-cli.svg?style=flat-square&color=green)](https://www.npmjs.com/package/exon-cli)

[![GitHub stars](https://img.shields.io/github/stars/arpitbhatia23/exon-cli.svg?style=flat-square&color=yellow)](https://github.com/arpitbhatia23/exon-cli/stargazers)

**Exon CLI** is a modern, ultra-fast **Express generator** and API scaffolding tool designed to bootstrap production-ready Express.js applications in under 30 seconds. Stop wasting hours manually setting up TypeScript configs, database ORMs, Swagger documentation, Docker files, and structured logging. Exon CLI generates clean, enterprise-grade, standard-compliant boilerplate instantly so you can focus on building features.

Designed as a drop-in, modern replacement for the legacy `express-generator`, Exon CLI offers fully pre-configured ES Module (ESM) support, a robust runtime plugin ecosystem, and deep TypeScript integration.

```bash
npx exon-cli create my-express-api
```

---

## 🚀 Why Developers Choose Exon CLI

Traditional Express setup is tedious, manual, and prone to configuration errors. Exon CLI turns hours of boilerplating into a single 30-second command.

### Legacy `express-generator` vs. Modern **Exon CLI**

| Feature                   |    Legacy `express-generator`    |                 ⚡ Exon CLI                  |
| :------------------------ | :------------------------------: | :------------------------------------------: |
| **Language Support**      |    JavaScript only (CommonJS)    |      **TypeScript & JavaScript (ESM)**       |
| **Scaffolding Time**      | 45 - 90 minutes of extra configs |         **30 Seconds (Zero-Config)**         |
| **Database Support**      |             ❌ None              |       **Prisma, Mongoose, & Drizzle**        |
| **API Documentation**     |             ❌ None              |      **Auto-generated Swagger/OpenAPI**      |
| **Containerization**      |             ❌ None              | **Production-ready Docker & Docker Compose** |
| **Advanced Logging**      |       ❌ Basic console.log       |   **Winston Logger & Morgan Integration**    |
| **Realtime Features**     |             ❌ None              |         **Built-in Socket.IO Setup**         |
| **Modular Extensibility** |          ❌ Monolithic           |    **Dynamic `add`/`remove` Plugin CLI**     |

---

## 📦 Core Features Included

Exon CLI is packed with all the tools required for modern Node.js and Express backend development:

- **TypeScript & JavaScript (ESM)**: Fully-configured `tsconfig.json` with ESM module resolution (`import`/`export`).
- **Swagger/OpenAPI Documentation**: Interactive API testing UI pre-loaded at `/docs`.
- **Database ORMs/ODMs**: Out-of-the-box setups for **Prisma**, **Drizzle**, and **Mongoose (MongoDB)**.
- **Robust Logging**: Enterprise-grade multi-transport logging via **Winston** and **Morgan** (console + file log rotation).
- **Containerization**: Pre-configured `Dockerfile`, `.dockerignore`, and multi-container `docker-compose.yml`.
- **Realtime Communication**: Pre-integrated **Socket.IO** server support.
- **Production Architecture**: Pre-configured global error handling, centralized environment variables schema, and unified async handler wrappers.

---

## 🛠️ CLI Commands & Options Reference

You can run Exon CLI interactively or pass flags to speed up your automation workflows.

### 1. Project Generation: `create <project-name>`

Generate a brand-new backend directory with your exact technology choices.

```bash
# Interactive setup:
npx exon-cli create my-api

# Non-interactive CLI flags setup:
npx exon-cli create my-api --ts --prisma --docker --logger --swagger --socket --pnpm

# With specific language, database, and package manager:
npx exon-cli create blog-api --ts --prisma --pnpm
npx exon-cli create ecommerce --ts --mongoose --yarn
npx exon-cli create microservice --js --drizzle --npm
```

#### Supported `create` Flags

| Flag         | Shorthand | Description                                                        |
| :----------- | :-------: | :----------------------------------------------------------------- |
| `--ts`       |   `-t`    | Generate a **TypeScript** backend (Default).                       |
| `--js`       |   `-j`    | Generate a **JavaScript** backend (ESM).                           |
| `--prisma`   |   `-p`    | Integrate **Prisma ORM** (PostgreSQL/MySQL/SQLite).                |
| `--mongoose` |   `-m`    | Integrate **Mongoose ODM** (MongoDB).                              |
| `--drizzle`  |   `-d`    | Integrate **Drizzle ORM** (PostgreSQL/MySQL/SQLite).               |
| `--npm`      |           | Use **npm** as package manager.                                    |
| `--pnpm`     |           | Use **pnpm** as package manager (Fast & efficient).                |
| `--yarn`     |           | Use **yarn** as package manager.                                   |
| `--bun`      |           | Use **bun** as package manager (Experimental).                     |
| `--docker`   |   `-D`    | Add **Docker** configuration (`Dockerfile`, `docker-compose.yml`). |
| `--logger`   |   `-L`    | Add structured **Winston** & **Morgan** logger.                    |
| `--swagger`  |   `-S`    | Add interactive **Swagger OpenAPI** API documentation.             |
| `--socket`   |           | Add **Socket.IO** realtime server configuration.                   |

---

## 🔌 Dynamic Plugin Management (`add` & `remove`)

One of Exon CLI's most powerful features is its **decoupled plugin architecture**. If you generated a basic project and later decide you need database integration or Docker containment, you can add or remove them instantly.

### Install a Feature

Add a new database, documentation, or containment system to your existing Exon project:

```bash
npx exon-cli add swagger
npx exon-cli add logger
npx exon-cli add prisma
npx exon-cli add docker
npx exon-cli add socket
```

### Uninstall a Feature

Cleanly remove any plugin and its configuration files from the project automatically:

```bash
npx exon-cli remove swagger
```

---

## 📂 Standard Enterprise Directory Structure

Exon CLI generates a clean, scalable folder structure designed for mid-to-large-scale software architectures.

```txt
my-api/
├── src/
│   ├── controllers/      # Handles incoming HTTP requests and response logic
│   ├── routes/           # Routing layers (e.g., users, status, docs)
│   ├── middleware/       # Express middlewares (auth, validation, error handler)
│   ├── db/               # Database client instantiation and schema configurations
│   ├── models/           # Mongoose schemas / Prisma models / Drizzle definitions
│   ├── utils/            # Shared utilities (apiError, apiResponse, asyncHandler)
│   ├── socket/           # Socket.IO connection and event namespaces
│   ├── app.ts            # Core Express app construction and service bindings
│   └── index.ts          # Server listener initialization
├── .env                  # Environment configuration variables
├── Dockerfile            # Container deployment specification
├── docker-compose.yml    # Multi-container local execution setup
├── exon.config.json      # CLI project state configuration
└── tsconfig.json         # Strict TypeScript compiler options
```

---

## ⚡ Quick Start Guide

### 1. Generate Your Express API

Bootstrap a TypeScript application with Prisma ORM, Docker, and your preferred package manager:

```bash
# Interactive mode - will prompt you to select language, database, and package manager
npx exon-cli create my-cool-app

# Or with flags - specify language, database, and package manager
npx exon-cli create my-cool-app --ts --prisma --docker --pnpm
npx exon-cli create another-api --ts --mongoose --yarn
```

**Package Manager Options:**

- `--npm` - Use npm (default if not specified interactively)
- `--pnpm` - Use pnpm for faster, disk-efficient dependency management
- `--yarn` - Use yarn for predictable dependency resolution
- `--bun` - Use bun for ultra-fast JavaScript execution (experimental)

### 2. Startup your server

```bash
cd my-cool-app

# Start the local development server with live reload:
npm run dev
```

### 3. Open Interactive API Documentation

Visit the following link in your browser to view your auto-generated API routes and test them:

```txt
http://localhost:3802/docs
```

---

## 🛡️ Centralized Configuration (`exon.config.json`)

To enable seamless add/remove plugin mechanics, Exon stores the current scaffolding options inside a lightweight state file at the root of your project:

```json
{
  "language": "TypeScript",
  "database": "PRISMA",
  "packageManger": "pnpm",
  "plugins": ["docker", "prisma", "logger", "swagger", "socket"]
}
```

---

## 🤝 Contributing & Support

We are excited about making backend development in Node.js faster for everyone! If you want to contribute plugins, templates, or improvements:

1.  **Star our Repository**: Show some love on [GitHub](https://github.com/arpitbhatia23/exon) ⭐
2.  **Report Issues**: Found a bug? Open an issue.
3.  **Submit PRs**: We welcome pull requests for adding database templates, auth plugins, or CLI optimizations.

```bash
# Install CLI locally for development
git clone https://github.com/arpitbhatia23/exon.git
cd exon
npm install
npm run build
```

---

## 🔍 SEO Search Keywords & Target Audience

Exon CLI is built for developers looking for:

- _Express generator ts / TypeScript Express generator_
- _Express project generator CLI_
- _Create-express-app template_
- _Express boilerplate with Swagger and Prisma_
- _Node.js Express backend builder_
- _Fastify / Express CLI scaffolders_

---

_Made with ⚡ by Arpit Bhatia and the Exon Community._
