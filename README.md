# Turborepo starter

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

- `docs`: a [Next.js](https://nextjs.org/) app
- `web`: another [Next.js](https://nextjs.org/) app
- `@repo/ui`: a stub React component library shared by both `web` and `docs` applications
- `@repo/eslint-config`: `eslint` configurations (includes `@next/eslint-plugin-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo build
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo build
pnpm exec turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo build --filter=docs
```

Without global `turbo`:

```sh
npx turbo build --filter=docs
pnpm exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo dev
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo dev
pnpm exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo dev --filter=web
```

Without global `turbo`:

```sh
npx turbo dev --filter=web
pnpm exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```

### Remote Caching

> [!TIP]
> Vercel Remote Cache is free for all plans. Get started today at [vercel.com](https://vercel.com/signup?utm_source=remote-cache-sdk&utm_campaign=free_remote_cache).

Turborepo can use a technique known as [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup?utm_source=turborepo-examples), then enter the following commands:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended):

```sh
cd my-turborepo
turbo login
```

Without global `turbo`, use your package manager:

```sh
cd my-turborepo
npx turbo login
pnpm exec turbo login
pnpm exec turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed:

```sh
turbo link
```

Without global `turbo`:

```sh
npx turbo link
pnpm exec turbo link
pnpm exec turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)

## Folder Structure

formflow/
├── apps/
│ ├── api/ # Fastify HTTP API
│ │ ├── src/
│ │ │ ├── index.ts # entry: loadConfig() first, then boot
│ │ │ ├── server.ts # Fastify instance, plugin registration
│ │ │ ├── plugins/ # db, storage, auth, error handler
│ │ │ ├── modules/ # one folder per domain
│ │ │ │ ├── auth/ # routes.ts, service.ts, schemas.ts
│ │ │ │ ├── forms/
│ │ │ │ ├── submissions/
│ │ │ │ ├── workspaces/
│ │ │ │ ├── uploads/
│ │ │ │ └── health/
│ │ │ └── db/
│ │ │ ├── schema.ts # Drizzle tables
│ │ │ ├── client.ts
│ │ │ ├── seed.ts
│ │ │ └── migrations/ # generated by drizzle-kit
│ │ ├── test/
│ │ ├── drizzle.config.ts
│ │ ├── package.json
│ │ └── tsconfig.json
│ │
│ ├── worker/ # BullMQ background jobs
│ │ ├── src/
│ │ │ ├── index.ts # loadConfig() first, then start workers
│ │ │ ├── queues.ts # queue names + shared connection
│ │ │ └── jobs/ # one file per job (email, export, webhook, pdf)
│ │ ├── package.json
│ │ └── tsconfig.json
│ │
│ ├── web/ # Vite + React
│ │ ├── src/
│ │ │ ├── main.tsx
│ │ │ ├── app/ # router, providers, layout
│ │ │ ├── features/ # builder/, forms/, submissions/, auth/
│ │ │ ├── components/ # shared UI components
│ │ │ ├── lib/ # api client, helpers
│ │ │ └── styles/
│ │ ├── public/
│ │ ├── index.html
│ │ ├── vite.config.ts
│ │ ├── package.json
│ │ └── tsconfig.json
│ │
│ └── renderer/ # Playwright: PDF / screenshot rendering
│ ├── src/
│ │ ├── index.ts
│ │ └── render.ts
│ ├── package.json
│ └── tsconfig.json
│
├── packages/
│ ├── engine/ # pure form logic, no I/O, runs in browser + server
│ │ ├── src/
│ │ │ ├── index.ts
│ │ │ ├── schema/ # form definition types + zod schemas
│ │ │ ├── validation/ # field + form validation
│ │ │ ├── logic/ # conditional visibility, branching, calculations
│ │ │ └── types.ts
│ │ ├── test/
│ │ ├── package.json
│ │ └── tsconfig.json
│ │
│ └── shared/ # server-side shared code
│ ├── src/
│ │ ├── index.ts
│ │ ├── config.ts # zod env loader
│ │ ├── storage/ # types.ts, s3.ts, index.ts, contract.test.ts
│ │ ├── queue/ # job names + payload types (used by api and worker)
│ │ ├── logger.ts
│ │ └── errors.ts
│ ├── package.json
│ └── tsconfig.json
│
├── infra/
│ ├── docker-compose.dev.yml
│ ├── minio/
│ │ └── cors.json
│ └── docker/ # Dockerfiles for api, worker, renderer (later)
│
├── docs/
│ ├── SETUP.md
│ └── adr/
│ ├── 0001-queue.md
│ ├── 0002-schema-format.md
│ ├── 0003-auth.md
│ └── 0004-storage-adapter.md
│
├── scripts/
│ └── bootstrap.sh
│
├── .devcontainer/
│ └── devcontainer.json
├── .husky/
│ ├── pre-commit
│ └── commit-msg
├── .github/
│ └── workflows/
│ └── ci.yml
│
├── .editorconfig
├── .env.example
├── .gitignore
├── .nvmrc
├── .prettierrc
├── commitlint.config.mjs
├── eslint.config.mjs
├── package.json # private root, orchestration scripts only
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md
