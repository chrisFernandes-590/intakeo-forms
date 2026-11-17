import { Hono } from "hono";
import { requestId } from "hono/request-id";
import { secureHeaders } from "hono/secure-headers";
import {
  configureCors,
  configureLogger,
  errorHandler,
  notFoundHandler,
} from "./plugins/index.js";
import { sendSuccess } from "./common/responses/index.js";
import { healthRoutes } from "./modules/health/index.js";
import { authRoutes } from "./modules/auth/index.js";
import { formsRoutes } from "./modules/forms/index.js";
import { submissionsRoutes } from "./modules/submissions/index.js";
import { workspacesRoutes } from "./modules/workspaces/index.js";
import { uploadsRoutes } from "./modules/uploads/index.js";
import type { Env } from "./config/env.js";

export interface ServerOptions {
  config?: Env;
}

export function createServer(_options?: ServerOptions) {
  const app = new Hono();

  // Global Core Middlewares
  app.use("*", requestId());
  app.use("*", configureLogger());
  app.use("*", configureCors());
  app.use("*", secureHeaders());

  // Root endpoint
  app.get("/", (c) => {
    return sendSuccess(
      c,
      {
        name: "intakeo-api",
        version: "0.1.0",
        documentation: "/docs",
      },
      200,
      "Intakeo Forms API is operational",
    );
  });

  // Module Routes Registration
  app.route("/health", healthRoutes);
  app.route("/auth", authRoutes);
  app.route("/forms", formsRoutes);
  app.route("/submissions", submissionsRoutes);
  app.route("/workspaces", workspacesRoutes);
  app.route("/uploads", uploadsRoutes);

  // Global Error & 404 Handlers
  app.onError(errorHandler);
  app.notFound(notFoundHandler);

  return app;
}
