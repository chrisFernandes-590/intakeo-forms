import { loadConfig } from "@app/shared";
import Fastify from "fastify";

// Validate env vars at startup
const config = loadConfig();

export async function buildApp() {
  const server = Fastify({
    logger: config.NODE_ENV !== "test",
  });

  server.get("/health", async () => {
    return { status: "ok" };
  });

  return server;
}

async function start() {
  const app = await buildApp();
  const port = Number(process.env.PORT) || 3001;

  try {
    await app.listen({ port, host: "0.0.0.0" });
    console.log(`API server listening on port ${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}
