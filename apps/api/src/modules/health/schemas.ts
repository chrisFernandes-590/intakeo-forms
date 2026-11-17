import { z } from "zod";

export const healthCheckResponseSchema = z.object({
  status: z.literal("healthy"),
  uptime: z.number(),
  timestamp: z.string(),
  version: z.string(),
});

export type HealthCheckResponse = z.infer<typeof healthCheckResponseSchema>;
