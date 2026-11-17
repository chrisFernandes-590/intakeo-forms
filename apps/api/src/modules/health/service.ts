import type { HealthCheckResponse } from "./schemas.js";

export class HealthService {
  public static getStatus(): HealthCheckResponse {
    return {
      status: "healthy",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: "0.1.0",
    };
  }
}
