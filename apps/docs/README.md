# Exon CLI Documentation

⚡ **Scaffold a production‑ready Express.js API in seconds** – with TypeScript, Prisma/Mongoose/Drizzle, Swagger UI, Docker, Winston logger, and a flexible plug‑in system.

---

## 🚀 Quick Start – Create a full‑stack API in 1 minute

```bash
npx exon-cli create my-api --ts --prisma --docker --swagger --pnpm
cd my-api
pnpm dev
```

Open the auto‑generated Swagger docs at `http://localhost:3802/docs`.

---

## 📦 Installation Guides

| Method | Command |
|---|---|
| **NPX (no global install)** | `npx exon-cli create <project>` |
| **Global via npm** | `npm install -g exon-cli` |
| **Global via pnpm** | `pnpm add -g exon-cli` |
| **Global via yarn** | `yarn global add exon-cli` |
| **Global via bun** | `bun add -g exon-cli` |

Verify the installation:

```bash
exon --version
```

---

## 🛠️ Core Commands Overview

| Command | Description |
|---|---|
| `exon-cli create <name>` | Scaffold a new Express project (interactive or flag‑based). |
| `exon-cli add <plugin>` | Add a plugin (Prisma, Mongoose, Swagger, Docker, Logger, Socket.io, …). |
| `exon-cli remove <plugin>` | Remove a previously added plugin. |

---

## 🔌 Plugin System – Extend Exon CLI

Exon CLI ships with a **plug‑in architecture**. Plugins are defined in `exon.config.json` and can be added or removed at any time.

### Adding Database Plugins

```bash
exon-cli add prisma      # PostgreSQL / MySQL ORM
exon-cli add mongoose    # MongoDB ODM
exon-cli add drizzle     # Lightweight SQL ORM
```

### Adding Tooling Plugins

```bash
exon-cli add swagger     # Auto‑generated OpenAPI UI
exon-cli add docker      # Dockerfile + docker‑compose.yml
exon-cli add logger      # Winston + Morgan logging
exon-cli add socket      # Socket.IO real‑time support
```

---

## 📂 Project Structure Explained

```
my-api/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # Express routes (v1, v2…)
│   ├── middleware/       # Auth, validation, error handling
│   ├── db/               # Prisma/Mongoose/Drizzle config
│   ├── models/           # TypeScript types & schemas
│   ├── utils/            # Logging, helpers
│   ├── socket/           # Socket.IO events (optional)
│   ├── app.ts            # Express app setup
│   └── index.ts          # Server entry point
├── .env.example          # Example environment file
├── Dockerfile            # Multi‑stage production build
├── docker-compose.yml    # dev services (Postgres, Mongo, etc.)
├── exon.config.json      # Project metadata & enabled plugins
└── tsconfig.json         # Strict TypeScript configuration
```

---

## 🐳 Docker & Containerization

When you enable the `--docker` flag, Exon CLI generates a ready‑to‑use `docker-compose.yml`:

```yaml
version: "3.9"
services:
  server:
    build: .
    ports:
      - "3802:3802"
    env_file:
      - .env
    networks:
      - exon-net
# Database services are added automatically based on the selected ORM.
networks:
  exon-net:
    driver: bridge
```

You can customize the generated file in `docker-compose.yml` after scaffolding.

---

## 📖 API Reference – CLI Flags

| Flag | Description |
|---|---|
| `--ts`, `-t` | Use TypeScript (default). |
| `--js`, `-j` | Use JavaScript (ESM). |
| `--prisma`, `-p` | Add Prisma ORM. |
| `--mongoose`, `-m` | Add Mongoose ODM. |
| `--drizzle`, `-d` | Add Drizzle ORM. |
| `--docker`, `-D` | Include Docker support. |
| `--logger`, `-L` | Enable Winston + Morgan logger. |
| `--swagger`, `-S` | Generate Swagger/OpenAPI docs. |
| `--socket`, `-s` | Add Socket.IO real‑time server. |
| `--npm` | Use npm as the package manager. |
| `--pnpm` | Use pnpm (default). |
| `--yarn` | Use Yarn. |
| `--bun` | Use Bun. |

---

## ❓ Frequently Asked Questions (FAQ)

**Q: Why not use `express‑generator`?**
> `express‑generator` creates a minimal CommonJS project with no TypeScript, no ORM, no Docker, and no OpenAPI docs. Exon CLI delivers a production‑ready stack in seconds.

**Q: Can I add a plugin after the project is created?**
> Yes. Run `exon-cli add <plugin>` inside the project folder. The CLI injects the necessary code, updates `package.json`, installs dependencies, and (if required) updates `docker-compose.yml`.

**Q: How do I switch the database later?**
> Remove the old plugin (`exon-cli remove mongoose`) and add the new one (`exon-cli add prisma`). The CLI will clean up files and re‑configure the Docker services.

**Q: How do I run the docs site locally?**
> ```bash
> cd apps/docs
> pnpm install
> pnpm dev
> ```
> The site is served at `http://localhost:5173`.

---

## 🤝 Contributing & Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/arpitbhatia23/exon-cli.git
   cd exon-cli/apps/docs
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   ```
3. **Run the docs site**
   ```bash
   pnpm dev
   ```
4. **Build for production**
   ```bash
   pnpm build
   ```
5. **Submit a Pull Request** – follow the repository’s `CONTRIBUTING.md` guidelines.

---

## 📜 License

This documentation is licensed under the MIT License – see the root `LICENSE` file.

---

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Why use Exon CLI instead of express-generator?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Exon CLI generates modern Express projects with built‑in TypeScript, Prisma/Mongoose/Drizzle ORM, Swagger documentation, Docker support and a plug‑in system – all in seconds."
      }
    },
    {
      "@type": "Question",
      "name": "How do I add Prisma to an existing project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Run `exon add prisma` inside the project folder. The CLI injects the Prisma schema, updates `package.json`, installs dependencies, and modifies Docker compose automatically."
      }
    },
    {
      "@type": "Question",
      "name": "Can I generate Docker compose for MongoDB?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Use the `--docker` flag together with `--mongoose`. The generated `docker-compose.yml` includes a MongoDB service and links it to the server container."
      }
    }
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://exon-cli.com/" },
    { "@type": "ListItem", "position": 2, "name": "Documentation", "item": "https://exon-cli.com/docs" }
  ]
}
</script>