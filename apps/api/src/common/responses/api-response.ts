import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
  meta?: Record<string, unknown> | PaginationMeta;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
  code?: string;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: ApiErrorDetail[] | unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown> | PaginationMeta,
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
  };
}

export function createErrorResponse(
  message: string,
  code = "INTERNAL_SERVER_ERROR",
  details?: unknown,
): ApiErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details !== undefined ? { details } : {}),
    },
  };
}

export function sendSuccess<T>(
  c: Context,
  data: T,
  status: ContentfulStatusCode = 200,
  message?: string,
  meta?: Record<string, unknown> | PaginationMeta,
): Response {
  return c.json(createSuccessResponse(data, message, meta), status);
}

export function sendCreated<T>(
  c: Context,
  data: T,
  message = "Resource created successfully",
): Response {
  return c.json(createSuccessResponse(data, message), 201);
}

export function sendNoContent(c: Context): Response {
  return c.body(null, 204);
}

export function sendError(
  c: Context,
  message: string,
  status: ContentfulStatusCode = 500,
  code = "INTERNAL_SERVER_ERROR",
  details?: unknown,
): Response {
  return c.json(createErrorResponse(message, code, details), status);
}

export function sendPaginated<T>(
  c: Context,
  items: T[],
  pagination: { page: number; limit: number; total: number },
  message?: string,
): Response {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const meta: PaginationMeta = {
    page: pagination.page,
    limit: pagination.limit,
    total: pagination.total,
    totalPages,
    hasNextPage: pagination.page < totalPages,
    hasPrevPage: pagination.page > 1,
  };

  return sendSuccess(c, items, 200, message, meta);
}
