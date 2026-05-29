# Exon CLI - Rapid Backend Scaffolding & Project Generation

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?logo=typescript)
![License](https://img.shields.io/badge/License-MIT-green)
![Node](https://img.shields.io/badge/Node.js-18+-brightgreen?logo=node.js)
![Monorepo](https://img.shields.io/badge/Monorepo-Turborepo-red?logo=turborepo)

> **Exon CLI** is a powerful command-line tool that accelerates backend development by automatically scaffolding production-ready Node.js/Express applications with built-in best practices, plugin architecture, and template-driven project generation.

## 🚀 Features

- ⚡ **Rapid Project Generation** - Create fully structured backend projects in seconds
- 📦 **Pre-built Templates** - Express.js templates in JavaScript and TypeScript with best practices
- 🔌 **Plugin System** - Extensible plugin architecture supporting Prisma, Drizzle, Mongoose, Socket.io, Docker, Swagger, and Logger
- 🏗️ **Monorepo Architecture** - Optimized Turborepo structure for scalable applications
- 📝 **Type Safety** - 100% TypeScript support across CLI and core packages
- ✨ **Code Quality** - Built-in ESLint and Prettier configurations
- 🔧 **Developer Friendly** - Interactive CLI with intuitive commands
- 📚 **Comprehensive Documentation** - Full docs and examples included

## 🎯 What Problems Does Exon Solve?

- **Bootstrap Fatigue** - Save hours setting up project structure, configurations, and boilerplate
- **Inconsistent Standards** - Ensures all projects follow the same coding standards and best practices
- **Configuration Hell** - Automated database, ORM, and middleware configuration
- **Scalability** - Monorepo support for managing multiple applications and shared packages
- **Time to Market** - Go from zero to production-ready in minutes

## 📦 Project Structure

```
exon-cli/
├── cli/                          # Command-line interface
├── packages/
│   └── cli-core/                 # Core CLI logic & business logic
│       ├── plugins/              # Plugin registry & execution engine
│       ├── project/              # Project configuration management
│       └── types/                # Shared TypeScript types
├── server/                       # Backend server (Node.js/Express)
├── templates/                    # Pre-built project templates
│   ├── node-express-template-js/ # JavaScript Express template
│   ├── node-express-template-ts/ # TypeScript Express template
│   └── plugins/                  # Plugin templates (Prisma, Drizzle, etc.)
├── apps/docs/                    # Documentation site (Next.js)
└── turbo.json                    # Turborepo configuration
```

## ⚙️ Quick Start

### Installation

```sh
npm install -g exon-cli
# or with yarn
yarn global add exon-cli
# or with pnpm
pnpm add -g exon-cli
```

### Create Your First Project

```sh
exon create my-backend-app
cd my-backend-app
npm run dev
```

### Add Plugins

Enhance your project with built-in plugins:

```sh
exon add prisma      # Add Prisma ORM
exon add mongoose    # Add Mongoose
exon add swagger     # Add Swagger documentation
exon add docker      # Add Docker support
exon add socket      # Add Socket.io
exon add logger      # Add logging
```

## 📚 Available Templates

- **Node Express TypeScript** - Full-featured Express.js template with TypeScript
- **Node Express JavaScript** - Express.js template in vanilla JavaScript
- Both include:
  - REST API structure
  - Database layer setup
  - Error handling utilities
  - Health check endpoints
  - Pre-configured routing

## 🔌 Supported Plugins

| Plugin          | Description                           |
| --------------- | ------------------------------------- |
| **Prisma**      | Modern ORM with database migrations   |
| **Drizzle**     | Lightweight SQL ORM & query builder   |
| **Mongoose**    | MongoDB object modeling               |
| **Socket.io**   | Real-time bidirectional communication |
| **Docker**      | Containerization with docker-compose  |
| **Swagger API** | Auto-generated API documentation      |
| **Logger**      | Structured logging configuration      |

## 🏗️ Architecture

Built as a **Monorepo** using Turborepo for:

- Efficient builds with incremental compilation
- Shared packages and configurations
- Fast parallel task execution
- Optimized for teams and scaling

## 💻 Development

### Build all packages

```sh
turbo build
```

### Start development mode

```sh
turbo dev
```

### Run tests

```sh
turbo test
```

## 📖 Use Cases

Exon CLI is perfect for:

- **Startup MVPs** - Launch production-ready backends in days, not weeks
- **Enterprise Microservices** - Consistent boilerplate across multiple services
- **SaaS Applications** - Database-agnostic templating with ORM flexibility
- **Real-time Applications** - Pre-configured Socket.io support
- **API-First Development** - REST APIs with automatic Swagger documentation
- **Team Collaboration** - Standardized project structure across teams
- **Learning Node.js** - Best practices built-in for developers new to Node.js

## 🔄 Why Choose Exon CLI?

| Aspect               | Exon CLI           | Manual Setup   | Other Tools |
| -------------------- | ------------------ | -------------- | ----------- |
| Setup Time           | **2 minutes**      | Hours          | 10-30 min   |
| Best Practices       | ✅ Built-in        | ❌ Your choice | ⚠️ Basic    |
| Plugin System        | ✅ Extensible      | ❌ Manual      | ⚠️ Limited  |
| Monorepo Support     | ✅ Yes             | ⚠️ Manual      | ❌ No       |
| Type Safety          | ✅ Full TypeScript | ⚠️ Optional    | ⚠️ Partial  |
| Database Flexibility | ✅ Multiple ORMs   | ⚠️ Manual      | ❌ Fixed    |

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

```sh
# Clone the repository
git clone https://github.com/yourusername/exon-cli.git
cd exon-cli

# Install dependencies
pnpm install

# Start development
turbo dev
```

## 📜 Code of Conduct

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) to understand community standards.

## 📄 License

MIT License - feel free to use Exon CLI in your projects ([LICENSE](./cli/LICENSE))

## 🙋 Support & Community

- 📖 [Full Documentation](./apps/docs/)
- 🐛 [Report Issues](https://github.com/yourusername/exon-cli/issues)
- 💡 [Feature Requests](https://github.com/yourusername/exon-cli/discussions)
- 💬 [Discussions & Q&A](https://github.com/yourusername/exon-cli/discussions)

## 🎓 Learning Resources

- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [Express.js Guide](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Turborepo Documentation](https://turborepo.dev/)
- [REST API Design Guidelines](https://restfulapi.net/)

## ⭐ Show Your Support

If Exon CLI helps you, give it a ⭐ on GitHub! Your support helps us grow the community.

## 🚀 Roadmap

- [ ] GUI-based project generator
- [ ] GraphQL template support
- [ ] Authentication plugins (JWT, OAuth, Passport.js)
- [ ] Testing framework integration (Jest, Vitest)
- [ ] CI/CD pipeline templates
- [ ] Cloud deployment helpers (AWS, GCP, Azure)
- [ ] Performance monitoring integration

## 📊 Project Stats

- 🎯 Production-ready templates
- 🔌 7+ Built-in plugins
- 📦 Monorepo architecture
- ⚡ Zero-config setup
- 🌍 TypeScript & JavaScript support

---

**Built with ❤️ by the Exon community**

[⬆ Back to top](#exon-cli---rapid-backend-scaffolding--project-generation)
