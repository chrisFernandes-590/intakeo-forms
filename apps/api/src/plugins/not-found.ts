import type { NotFoundHandler } from "hono";
import { createErrorResponse } from "../common/responses/index.js";

export const notFoundHandler: NotFoundHandler = (c) => {
  return c.json(
    createErrorResponse(
      `Route not found: ${c.req.method} ${c.req.path}`,
      "NOT_FOUND",
    ),
    404,
  );
};
