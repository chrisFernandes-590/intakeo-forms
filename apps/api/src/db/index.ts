import { loadConfig } from "@app/shared";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema.js";

const config = loadConfig();

export const queryClient = postgres(config.DATABASE_URL, { max: 10 });
export const db = drizzle(queryClient, { schema });
