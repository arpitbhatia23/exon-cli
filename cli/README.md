# ⚡ Exon CLI — Modern Express.js Generator with TypeScript, Swagger, Docker & ORM Support

<img src="https://raw.githubusercontent.com/arpitbhatia23/exon-cli/main/asset/demo.gif" width="900" />

<p align="center">
  <b>Build a production-ready Express.js backend in seconds — TypeScript, JavaScript, Prisma, Mongoose, Drizzle, Swagger, Docker, Logger, and Socket.IO.</b>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/exon-cli">
    <img src="https://img.shields.io/npm/v/exon-cli.svg?style=flat-square&color=blue" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/exon-cli">
    <img src="https://img.shields.io/npm/dm/exon-cli.svg?style=flat-square&color=green" alt="npm downloads" />
  </a>
  <a href="https://github.com/arpitbhatia23/exon">
    <img src="https://img.shields.io/github/stars/arpitbhatia23/exon.svg?style=flat-square&color=yellow" alt="GitHub stars" />
  </a>
</p>

---

## 🚀 What is Exon CLI?

**Exon CLI** is a modern **Express.js project generator** and **TypeScript backend scaffolding CLI** that helps developers create clean, scalable, production-ready REST API projects in seconds.

It is built as a modern alternative to the old `express-generator`, but with real-world backend features included:

- TypeScript and JavaScript ESM support
- Prisma, Mongoose, and Drizzle ORM setup
- Swagger/OpenAPI documentation
- Docker and Docker Compose
- Winston + Morgan logger
- Socket.IO realtime setup
- Plugin-based `add` and `remove` commands
- Clean scalable backend folder structure

```bash
npx exon-cli create my-api
```

---

## ⭐ Support Exon CLI

If Exon CLI saves your setup time, please consider giving it a star on GitHub.

👉 **Star the repo:** https://github.com/arpitbhatia23/exon

Your star helps more developers discover this project and motivates continued development.

---

## ⚡ Quick Demo

```bash
npx exon-cli create my-api --ts --mongoose --swagger --docker --logger --pnpm

cd my-api

pnpm dev
```

Open Swagger docs:

```txt
http://localhost:3802/docs
```

---

## 🔥 Why Developers Use Exon CLI

Setting up an Express.js backend manually takes time:

- TypeScript config
- Folder structure
- Error handling
- Environment setup
- Database connection
- Swagger docs
- Docker files
- Logger setup
- API response utilities

**Exon CLI does this instantly.**

It helps you go from idea to working backend much faster.

---

## 🆚 Exon CLI vs express-generator

| Feature                     | express-generator | Exon CLI |
| --------------------------- | ----------------: | -------: |
| TypeScript support          |                ❌ |       ✅ |
| JavaScript ESM support      |                ❌ |       ✅ |
| Prisma setup                |                ❌ |       ✅ |
| Mongoose setup              |                ❌ |       ✅ |
| Drizzle setup               |                ❌ |       ✅ |
| Swagger docs                |                ❌ |       ✅ |
| Docker setup                |                ❌ |       ✅ |
| Logger setup                |                ❌ |       ✅ |
| Socket.IO setup             |                ❌ |       ✅ |
| Add/remove plugins          |                ❌ |       ✅ |
| Production folder structure |             Basic |       ✅ |

---

## 📦 Installation

Use directly with `npx`:

```bash
npx exon-cli create my-api
```

Or install globally:

```bash
npm install -g exon-cli
```

```bash
exon create my-api
```

---

## 🛠️ Create a New Express App

### Interactive Mode

```bash
npx exon-cli create my-api
```

### With Flags

```bash
npx exon-cli create my-api --ts --prisma --docker --logger --swagger --pnpm
```

```bash
npx exon-cli create blog-api --ts --mongoose --swagger --npm
```

```bash
npx exon-cli create realtime-api --ts --socket --logger --pnpm
```

---

## 🔌 Add Features Later

You can start simple and add features whenever needed.

```bash
npx exon-cli add swagger
npx exon-cli add logger
npx exon-cli add mongoose
npx exon-cli add prisma
npx exon-cli add drizzle
npx exon-cli add docker
npx exon-cli add socket
```

---

## 🧹 Remove Features

```bash
npx exon-cli remove swagger
```

More plugin removal support is coming soon.

---

## 📁 Generated Folder Structure

```txt
my-api/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   ├── models/
│   ├── utils/
│   ├── socket/
│   ├── app.ts
│   └── index.ts
├── .env
├── Dockerfile
├── docker-compose.yml
├── exon.config.json
└── tsconfig.json
```

---

## 🎯 Best For

Exon CLI is useful for:

- MERN stack projects
- REST API development
- SaaS backend setup
- College and portfolio projects
- Production Express.js boilerplates
- TypeScript Node.js backend projects
- Prisma/Mongoose/Drizzle starter projects
- Developers who want a faster alternative to `express-generator`

---

## 🔍 SEO Keywords

Exon CLI targets developers searching for:

- Express generator
- Express TypeScript generator
- Express.js boilerplate
- Node.js backend boilerplate
- Express project generator
- TypeScript Express starter
- Express Prisma boilerplate
- Express Mongoose boilerplate
- Express Swagger boilerplate
- Docker Express.js starter
- create express app
- express-generator alternative
- Node.js REST API starter
- MERN backend generator
- Express CLI scaffold

---

## 🤝 Contributing

Contributions are welcome.

You can help by:

- Starring the repo
- Reporting bugs
- Suggesting plugin ideas
- Improving docs
- Creating new templates
- Submitting pull requests

```bash
git clone https://github.com/arpitbhatia23/exon.git
cd exon
npm install
npm run build
```

---

## 📢 Share Exon CLI

If you like this project, share it with other developers:

```bash
npx exon-cli create my-api
```

**GitHub:** https://github.com/arpitbhatia23/exon
**npm:** https://www.npmjs.com/package/exon-cli

---

## 🧑‍💻 Author

Made with ⚡ by **Arpit Bhatia**

If this project helped you, please give it a ⭐ on GitHub.
