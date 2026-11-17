import type { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { AppError } from "../common/errors/index.js";
import {
  createErrorResponse,
  type ApiErrorDetail,
} from "../common/responses/index.js";

export const errorHandler: ErrorHandler = (err, c) => {
  const isProduction = process.env.NODE_ENV === "production";

  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const details: ApiErrorDetail[] = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
      code: issue.code,
    }));

    return c.json(
      createErrorResponse("Validation error", "VALIDATION_ERROR", details),
      400,
    );
  }

  // 2. Custom AppError instances (operational errors)
  if (err instanceof AppError) {
    return c.json(
      createErrorResponse(err.message, err.code, err.details),
      err.statusCode as ContentfulStatusCode,
    );
  }

  // 3. Hono Built-in HTTPException
  if (err instanceof HTTPException) {
    return c.json(
      createErrorResponse(err.message || "HTTP Exception", "HTTP_EXCEPTION"),
      err.status as ContentfulStatusCode,
    );
  }

  // 4. Unexpected / Unhandled System Errors
  console.error("[Unhandled Error]:", err);

  const message = isProduction
    ? "An unexpected internal server error occurred"
    : err.message || "Internal Server Error";

  const details = isProduction
    ? undefined
    : {
        name: err.name,
        stack: err.stack,
      };

  return c.json(
    createErrorResponse(message, "INTERNAL_SERVER_ERROR", details),
    500,
  );
};
