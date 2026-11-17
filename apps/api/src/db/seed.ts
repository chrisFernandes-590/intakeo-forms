import { getDb, closeDbConnection } from "./client.js";

/**
 * Database seed runner boilerplate.
 */
async function seed(): Promise<void> {
  console.log("🌱 Starting database seed...");
  // Initialize DB instance
  getDb();

  // Add domain seed operations here as entities are created
  console.log("✅ Database seed completed successfully.");
}

seed()
  .catch((err) => {
    console.error("❌ Database seed failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await closeDbConnection();
    process.exit(0);
  });
