import { logger } from "hono/logger";

export function configureLogger() {
  return logger();
}
