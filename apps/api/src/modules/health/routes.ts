import { Hono } from "hono";
import { sendSuccess } from "../../common/responses/index.js";
import { HealthService } from "./service.js";

export const healthRoutes = new Hono();

healthRoutes.get("/", (c) => {
  const healthData = HealthService.getStatus();
  return sendSuccess(c, healthData, 200, "Service is operational");
});
