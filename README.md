# Production-Ready Auth & User CRUD Backend API

A robust, scalable, and secure backend boilerplate for modern web applications. Built with Node.js, Express 5, TypeScript, and Prisma 7, this API handles enterprise-grade authentication using secure HTTP-only cookies, structural input validation via Zod v4, and complete User management sitting behind an automated Jest testing suite.

## 🚀 Project Overview

This backend serves as a high-performance foundation repo for user authentication and management. It features:

- **Express 5 Ecosystem** - Fully utilizes the latest Express routing engine with native async/await error resolution, completely eliminating redundant try/catch blocks.
- **Secure Token Authentication** - Dual-token authentication architecture (Access and Refresh JWTs) delivered strictly via tamper-proof `httpOnly` cookies to eliminate XSS vulnerability windows.
- **Fail-Fast Input Validation** - Advanced request interception utilizing Zod v4 schemas to filter, sanitize, and validate incoming payloads before hitting controllers.
- **Strict Authorization Guards** - Route-level middleware checkpoints providing seamless session verification and type-safe `req.user` populating.
- **Comprehensive Jest Testing Suite** - Completely structured unit testing and endpoint integration testing pipelines powered by Jest and fully isolated via hoisting-safe database mocking.
- **Relational Data Management** - Highly optimized, memory-efficient relational queries utilizing the Prisma 7 Object-Relational Mapper.

---

## 🛠️ Tech Stack

- Node.js + Express 5
- TypeScript for end-to-end type safety
- Prisma 7 ORM for database modeling and migrations
- PostgreSQL as the primary relational database
- Zod v4 for runtime structural parsing and error mapping
- Jest, Supertest, & `jest-mock-extended` for state-isolated testing workflows
- Bcrypt & Jsonwebtoken for industrial password cryptography and signing

Note: exact package versions are in `package.json`.

## 📁 Project Structure

Top-level `src/` layout:

```text
src/
├── app.ts                  # Express application configuration & global middleware
├── server.ts               # HTTP live network listener entry point
├── config/                 # Relational database client instances
│   └── db.ts
├── controllers/            # HTTP request mapping & cookie attachment controllers
│   ├── auth.controller.ts
│   └── user.controller.ts
├── middlewares/            # Security filters, validators, and centralized error catchers
│   ├── auth.middleware.ts
│   ├── errorHandler.ts
│   └── validate.ts
├── models/                 # Input validation parsing schemas (Zod v4)
│   ├── auth.schema.ts
│   └── user.schema.ts
├── routes/                 # RESTful pipeline path routers
│   ├── auth.routes.ts
│   └── user.routes.ts
├── services/               # Framework-agnostic pure database business logic
│   ├── auth.service.ts
│   └── user.service.ts
├── tests/                  # 🧪 Automated Unit & Integration Testing Environment
│   ├── unit/               # Isolated logical unit tests (controllers, utils)
│   └── integration/        # Full-pipeline HTTP route integration tests
└── utils/                  # Global cryptographic and operational error utilities
    ├── appError.ts
    └── authUtils.ts
```

Edit database schemas and models in the root `prisma/schema.prisma` file.

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* PostgreSQL installed and running locally (or a cloud DB like Supabase/Neon)
* npm or yarn

### Installation & Running

1. **Clone the repository**

```bash
   git clone https://github.com/jcmcardama/server-backend.git
   cd server-backend
```

2. **Install dependencies**

```bash
   npm install
```

3. **Configure Environment Variables**
Create a `.env` file in the root directory and add your local configurations:

```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/auth_db?schema=public"
   ACCESS_TOKEN_SECRET="your_ultra_secure_access_cryptographic_key_string"
   REFRESH_TOKEN_SECRET="your_ultra_secure_refresh_cryptographic_key_string"
```

4. **Initialize the Database**
Run Prisma migrations to generate the tables and the TypeScript client:

```bash
   npx prisma generate
   npx prisma migrate dev --name init
```

5. **Start the development server**

```bash
   npm run dev
```

The API will be available at `http://localhost:3000`

---

## 📝 Available Scripts

* `npm run dev` - Start development server with hot-reloading (via nodemon and ts-node)
* `npm run test` - Execute the entire Jest testing suite (Unit & Integration) using in-memory proxies
* `npm run build` - Compile the TypeScript source code into a production-ready JavaScript bundle inside `/dist`
* `npm start` - Run the compiled production build
* `npx prisma studio` - Open a local visual database browser to inspect and modify database records

---

## ✨ Key Features

✅ **Modern Express 5 Engine** - Built with native async pipeline resolution to build cleaner, synchronous-looking controller scopes

✅ **Strict XSS & CSRF Mitigation** - Stores JWT sessions purely inside HTTP-Only, SameSite=Strict secure cookie containers

✅ **Zod v4 Schema Defense** - Intercepts invalid, empty, or malicious properties at the gate with structured validation responses

✅ **100% In-Memory Test Layering** - Complete structural validation and pipeline verification testing free of database side-effects

✅ **Clean Data Separation** - Domain-driven separation of concerns (Routes -> Controllers -> Services -> DB)

✅ **Prisma 7 Singleton Patterns** - Implements optimized resource pooling across connection requests to completely prevent socket leaks

---

## 📧 Get In Touch

I'm always interested in hearing about new opportunities and collaborations.

* **[Email](https://www.google.com/search?q=mailto%3Ajcmcardama%40gmail.com)**
* **[LinkedIn](https://www.linkedin.com/in/jan-carlo-cardama/)**
* **[GitHub](https://github.com/jcmcardama)**
* **[Portfolio](https://jcmcardama-portfolio.vercel.app/)**

---

**Made with ❤️ by Jan Carlo M. Cardama**
