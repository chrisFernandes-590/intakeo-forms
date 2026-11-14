import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadConfig } from "@app/shared";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

const config = loadConfig();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function runMigrations(): Promise<void> {
  const sql = postgres(config.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  console.log("Applying database migrations...");
  const migrationsFolder = resolve(__dirname, "../../drizzle/migrations");
  await migrate(db, { migrationsFolder });
  console.log("Migrations applied successfully.");

  await sql.end();
}

if (process.env.NODE_ENV !== "test") {
  runMigrations().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}
