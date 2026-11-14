import { loadConfig } from "@app/shared";
import { Queue, Worker } from "bullmq";
import { Redis } from "ioredis";

// Validate env vars at startup
const config = loadConfig();

const connection = new Redis(config.REDIS_URL, {
  maxRetriesPerRequest: null,
});

export const sampleQueue = new Queue("form-submissions", { connection });

export const sampleWorker = new Worker(
  "form-submissions",
  async (job) => {
    return { processed: job.id };
  },
  { connection },
);

async function start(): Promise<void> {
  try {
    if (connection.status === "ready") {
      console.log("ready");
      return;
    }
    await new Promise<void>((resolve, reject) => {
      connection.once("ready", () => {
        console.log("ready");
        resolve();
      });
      connection.once("error", (err) => {
        reject(err);
      });
    });
  } catch (err) {
    console.error("Worker failed to connect to Redis:", err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== "test") {
  start();
}
