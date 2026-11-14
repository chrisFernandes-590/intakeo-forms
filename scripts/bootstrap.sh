#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${ROOT_DIR}"

echo "=== FormFlow Monorepo Bootstrap ==="

# 1. Enable Corepack and verify package manager
echo "==> Enabling Corepack..."
if command -v corepack >/dev/null 2>&1; then
  corepack enable || true
fi

# 2. Install workspace dependencies
echo "==> Installing dependencies with pnpm..."
pnpm install

# 3. Environment configuration setup
if [ ! -f .env ]; then
  echo "==> Copying .env.example to .env..."
  cp .env.example .env
else
  echo "==> Existing .env detected."
fi

# 4. Start local infrastructure services
echo "==> Starting local infrastructure (docker compose)..."
pnpm infra:up

# 5. Wait for Postgres to be healthy
echo "==> Waiting for Postgres database to be healthy..."
MAX_ATTEMPTS=30
ATTEMPT=0
until docker compose -f infra/docker-compose.dev.yml exec -T postgres pg_isready -U postgres -d formflow >/dev/null 2>&1; do
  ATTEMPT=$((ATTEMPT + 1))
  if [ "${ATTEMPT}" -ge "${MAX_ATTEMPTS}" ]; then
    echo "ERROR: Postgres did not become healthy within ${MAX_ATTEMPTS} seconds."
    exit 1
  fi
  sleep 1
done
echo "==> Postgres is healthy and accepting connections."

# 6. Apply database migrations
echo "==> Running database migrations..."
pnpm migrate

# 7. Seed initial database data
echo "==> Seeding database..."
pnpm seed

echo ""
echo "=========================================="
echo " FormFlow bootstrap completed successfully!"
echo " Start development with: pnpm dev"
echo "=========================================="
