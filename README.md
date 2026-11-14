# formflow

A modern form builder and submission platform monorepo.

## Workspaces

- `apps/api`: Fastify REST API for form management, submission endpoints, and health monitoring.
- `apps/worker`: BullMQ background job processor for asynchronous form submission pipelines.
- `apps/web`: Vite + React frontend application.
- `apps/renderer`: Node + Playwright service stub for form rendering and export.
- `packages/shared`: Shared configuration loader (zod), shared utilities, and common types.
- `packages/engine`: Core form schema evaluation and validation engine.
- `infra/`: Docker Compose configuration for local backing services (Postgres, Redis, MinIO, Mailpit).

## Quick Start

See [docs/SETUP.md](docs/SETUP.md) for full onboarding instructions.

```bash
bash scripts/bootstrap.sh
pnpm dev
```
