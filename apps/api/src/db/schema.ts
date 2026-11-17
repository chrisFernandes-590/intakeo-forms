import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

/**
 * Common reusable timestamp column definitions.
 */
export const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
};

/**
 * Baseline schema table for testing DB connectivity and migrations setup.
 * Domain entity tables (users, forms, submissions, etc.) will be added as features are developed.
 */
export const healthCheckLogs = pgTable("health_check_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  status: text("status").notNull().default("ok"),
  ...timestamps,
});
