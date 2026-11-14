# FormFlow Setup & Onboarding Guide

Welcome to FormFlow! This guide walks you through setting up a complete local development environment from scratch in under 15 minutes.

---

## 1. Prerequisites

Before getting started, make sure your machine has:

- **Node.js**: Version 22 LTS (recommended via `nvm`: `nvm install 22 && nvm use 22`).
- **Corepack / pnpm**: pnpm 9 (`corepack enable` or `pnpm@9.15.4` is configured automatically via `packageManager`).
- **Docker & Docker Compose**: Docker Desktop (Mac/Windows), OrbStack, or Colima running.

---

## 2. One-Command Setup

Run the bootstrap script from the repository root:

```bash
bash scripts/bootstrap.sh
```

This single command will:

1. Enable Corepack to manage `pnpm 9`.
2. Install all monorepo dependencies and link workspace packages (`@app/*`).
3. Generate `.env` from `.env.example` if it doesn't already exist.
4. Launch local infrastructure containers via Docker Compose (Postgres 16, Redis 7, Mailpit).
5. Wait for the Postgres healthcheck to pass.
6. Apply Drizzle database migrations.
7. Run the idempotent database seed script.

### Alternative: VS Code Dev Containers

If you use VS Code with Remote Containers or GitHub Codespaces:

1. Open the project in VS Code.
2. Click **Reopen in Container** when prompted.
3. The Dev Container will automatically provision Node 22, Docker-in-Docker, and execute `scripts/bootstrap.sh`.

---

## 3. Starting the Applications

Once bootstrapped, run all services concurrently:

```bash
pnpm dev
```

This starts:

- **API**: Fastify REST server on port `3001`
- **Worker**: BullMQ background processor connected to Redis
- **Web**: Vite + React development server on port `5173`

---

## 4. Service URLs & Ports

| Service            | Port   | Description / URL                                        | Credentials             |
| :----------------- | :----- | :------------------------------------------------------- | :---------------------- |
| **API**            | `3001` | http://localhost:3001/health                             | N/A                     |
| **Web Frontend**   | `5173` | http://localhost:5173                                    | N/A                     |
| **PostgreSQL 16**  | `5432` | `postgresql://postgres:postgres@localhost:5432/formflow` | `postgres` / `postgres` |
| **Redis 7**        | `6379` | `redis://localhost:6379`                                 | N/A                     |
| **Mailpit Web UI** | `8025` | http://localhost:8025                                    | N/A                     |
| **Mailpit SMTP**   | `1025` | `localhost:1025`                                         | N/A                     |

---

## 5. Seed Data & Accounts

The database seed (`pnpm seed`) is completely idempotent and provisions:

- **Workspace**: `Demo Workspace` (slug: `demo-workspace`, ID: `00000000-0000-0000-0000-000000000001`)
- **User**: `demo@example.com` (password: `password123`, scrypt hashed, ID: `00000000-0000-0000-0000-000000000002`)
- **Membership**: Links Demo User as `owner` of Demo Workspace
- **Sample Forms**:
  - `contact`: Contact Form (fields: Name, Email, Message)
  - `survey`: Customer Feedback Survey (fields: Satisfaction, Recommend, Feedback)
  - `signup`: Newsletter Signup (fields: Email, Interests, Consent)

---

## 6. Monorepo Scripts Reference

All commands can be run directly from the repo root:

```bash
# Development
pnpm dev            # Starts api, worker, and web concurrently
pnpm build          # Builds all packages and apps via Turborepo
pnpm test           # Runs Vitest tests across all packages and apps
pnpm typecheck      # Typechecks all packages and apps (strict mode)
pnpm lint           # Runs ESLint (flat config)
pnpm format         # Formats files using Prettier

# Database & Infrastructure
pnpm infra:up       # Spins up local Docker services in background
pnpm infra:down     # Stops local Docker services
pnpm migrate        # Executes Drizzle ORM migrations
pnpm seed           # Runs idempotent seed script
```

---

## 7. Architectural Decisions & Notes

See the Architecture Decision Records in [`docs/adr/`](adr/):

- **Queue**: [0001-queue.md](adr/0001-queue.md) - BullMQ + Redis selected over pg-boss for ultra-low latency bursts and decoupling from OLTP transactions.
- **Schema Format**: [0002-schema-format.md](adr/0002-schema-format.md) - JSON Schema + UI extensions selected for portability and native JSONB storage over custom DSLs or runtime-only Zod schemas.
- **Authentication**: [0003-auth.md](adr/0003-auth.md) - Server-backed session cookies selected for instant revocation and XSS resistance over stateless JWTs.

---

## 8. Troubleshooting

### 1. "Cannot connect to the Docker daemon"

Ensure Docker Desktop, OrbStack, or Colima is launched before running `bash scripts/bootstrap.sh` or `pnpm infra:up`.

### 2. Port already in use (5432 or 6379)

If you have a local PostgreSQL or Redis service running on your host machine:

```bash
# Check what is listening on port 5432
lsof -i :5432
# Stop local postgres (e.g. brew services stop postgresql)
```

### 3. Missing Environment Variable Error

Both `apps/api` and `apps/worker` execute the strict `@app/shared` Zod configuration loader at startup. If any required variable (such as `DATABASE_URL` or `SESSION_SECRET` with < 32 characters) is missing or invalid, the process will print a readable list of failing variables and immediately exit with code 1.
Verify your `.env` contains all variables listed in `.env.example`.
