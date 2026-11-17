import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";
import { getConfig } from "../config/env.js";

let queryClient: postgres.Sql | null = null;
let dbInstance: PostgresJsDatabase<typeof schema> | null = null;

/**
 * Returns the Drizzle ORM database instance with the initialized schema.
 * Connection is lazily initialized on first access.
 */
export function getDb(): PostgresJsDatabase<typeof schema> {
  if (!dbInstance) {
    const config = getConfig();
    queryClient = postgres(config.DATABASE_URL, {
      max: config.NODE_ENV === "production" ? 20 : 5,
      idle_timeout: 30,
      connect_timeout: 10,
    });
    dbInstance = drizzle(queryClient, { schema });
  }
  return dbInstance;
}

/**
 * Exported database client proxy. Automatically initializes connection on first property access.
 */
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
  get(_target, prop) {
    const instance = getDb();
    return (instance as any)[prop];
  },
});

/**
 * Closes the underlying database connection pool gracefully.
 */
export async function closeDbConnection(): Promise<void> {
  if (queryClient) {
    await queryClient.end({ timeout: 5 });
    queryClient = null;
    dbInstance = null;
  }
}
