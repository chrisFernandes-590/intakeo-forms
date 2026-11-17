import { serve } from "@hono/node-server";
import { loadConfig } from "./config/env.js";
import { createServer } from "./server.js";
import { closeDbConnection } from "./db/client.js";

async function bootstrap() {
  // 1. Load and validate environment configuration first
  const config = loadConfig();

  // 2. Initialize Hono server with registered plugins & routes
  const app = createServer({ config });

  // 3. Boot HTTP server via @hono/node-server
  const server = serve(
    {
      fetch: app.fetch,
      port: config.PORT,
      hostname: config.HOST,
    },
    (info) => {
      console.log(`\n🚀 Intakeo Forms API started successfully`);
      console.log(`   - URL: http://${info.address}:${info.port}`);
      console.log(`   - Environment: ${config.NODE_ENV}`);
      console.log(`   - Process ID: ${process.pid}\n`);
    },
  );

  // 4. Graceful shutdown handler
  let isShuttingDown = false;
  const gracefulShutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    console.log(`\n[${signal}] Initiating graceful shutdown...`);

    server.close(async (err) => {
      if (err) {
        console.error("Error closing HTTP server:", err);
      } else {
        console.log("HTTP server closed.");
      }

      try {
        await closeDbConnection();
        console.log("Database connections closed.");
      } catch (dbErr) {
        console.error("Error closing database connections:", dbErr);
      }

      process.exit(err ? 1 : 0);
    });

    // Force shutdown after timeout if graceful close hangs
    setTimeout(() => {
      console.error("Forceful shutdown due to timeout.");
      process.exit(1);
    }, 10000).unref();
  };

  process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
}

bootstrap().catch((error) => {
  console.error("❌ Failed to start API server:", error);
  process.exit(1);
});
