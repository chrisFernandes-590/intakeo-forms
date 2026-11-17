import { cors } from "hono/cors";
import { getConfig } from "../config/env.js";

export function configureCors() {
  const config = getConfig();

  return cors({
    origin:
      config.CORS_ORIGIN === "*"
        ? "*"
        : config.CORS_ORIGIN.split(",").map((o) => o.trim()),
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposeHeaders: ["Content-Length", "X-Request-Id"],
    maxAge: 86400,
    credentials: config.CORS_ORIGIN !== "*",
  });
}
