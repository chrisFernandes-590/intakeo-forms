import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import dotenv from "dotenv";
import { z } from "zod";

function loadDotenv(): void {
  let curr = process.cwd();
  for (let i = 0; i < 5; i++) {
    const candidate = resolve(curr, ".env");
    if (existsSync(candidate)) {
      dotenv.config({ path: candidate });
      break;
    }
    const parent = dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
}

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  REDIS_URL: z.string().min(1, "REDIS_URL is required"),
  SMTP_HOST: z.string().min(1, "SMTP_HOST is required"),
  SMTP_PORT: z.coerce.number().int().positive("SMTP_PORT must be a positive integer"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
});

export type Config = z.infer<typeof envSchema>;

export function loadConfig(rawEnv: Record<string, unknown> = process.env): Config {
  loadDotenv();
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    console.error("Configuration validation failed:");
    for (const issue of result.error.issues) {
      const varName = issue.path.join(".");
      console.error(`  - ${varName}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}
