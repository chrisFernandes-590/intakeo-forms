export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details?: unknown,
    isOperational = true,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(
    message = "Bad Request",
    details?: unknown,
    code = "BAD_REQUEST",
  ) {
    super(message, 400, code, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(
    message = "Unauthorized",
    details?: unknown,
    code = "UNAUTHORIZED",
  ) {
    super(message, 401, code, details);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", details?: unknown, code = "FORBIDDEN") {
    super(message, 403, code, details);
  }
}

export class NotFoundError extends AppError {
  constructor(
    message = "Resource not found",
    details?: unknown,
    code = "NOT_FOUND",
  ) {
    super(message, 404, code, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", details?: unknown, code = "CONFLICT") {
    super(message, 409, code, details);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(
    message = "Unprocessable Entity",
    details?: unknown,
    code = "UNPROCESSABLE_ENTITY",
  ) {
    super(message, 422, code, details);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(
    message = "Too Many Requests",
    details?: unknown,
    code = "TOO_MANY_REQUESTS",
  ) {
    super(message, 429, code, details);
  }
}

export class InternalServerError extends AppError {
  constructor(
    message = "Internal Server Error",
    details?: unknown,
    code = "INTERNAL_SERVER_ERROR",
  ) {
    super(message, 500, code, details, false);
  }
}
