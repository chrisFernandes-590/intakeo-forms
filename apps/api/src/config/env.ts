import { z } from "zod";
import dotenv from "dotenv";

// Load .env file if available
dotenv.config();

export const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required")
    .default("postgresql://postgres:postgres@localhost:5432/intakeo_forms"),
  CORS_ORIGIN: z.string().default("*"),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace"])
    .default("info"),
});

export type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Validates and returns the application environment configuration.
 * Fails fast with clear error messages if validation fails.
 */
export function loadConfig(): Env {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("\n❌ Invalid environment configuration:");
    for (const issue of result.error.issues) {
      console.error(`   - ${issue.path.join(".")}: ${issue.message}`);
    }
    console.error("\nPlease check your .env file or environment variables.\n");
    throw new Error("Environment configuration validation failed");
  }

  cachedEnv = result.data;
  return cachedEnv;
}

/**
 * Get loaded configuration or load it if not yet initialized.
 */
export function getConfig(): Env {
  if (!cachedEnv) {
    return loadConfig();
  }
  return cachedEnv;
}
