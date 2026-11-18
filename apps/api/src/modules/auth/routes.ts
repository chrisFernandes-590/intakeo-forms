import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { signUpEmailSchema, signInEmailSchema } from "./schemas.js";
import { AuthService } from "./service.js";
import { sendCreated, sendSuccess } from "../../common/responses/index.js";
import { UnauthorizedError } from "../../common/errors/index.js";

export const authRoutes = new Hono();

/**
 * POST /auth/sign-up
 * Create a new user with email and password via Neon Auth.
 */
authRoutes.post(
  "/sign-up",
  zValidator("json", signUpEmailSchema),
  async (c) => {
    const body = c.req.valid("json");
    const origin =
      c.req.header("origin") ||
      (c.req.header("host")
        ? `${c.req.header("x-forwarded-proto") || "http"}://${c.req.header("host")}`
        : "http://localhost:4000");

    const result = await AuthService.signUp(body, { origin });

    if (result.setCookieHeader) {
      c.header("Set-Cookie", result.setCookieHeader);
    }

    return sendCreated(
      c,
      {
        user: result.user,
        token: result.token,
      },
      "User signed up successfully",
    );
  },
);

/**
 * POST /auth/sign-in
 * Authenticate user with email and password via Neon Auth.
 */
authRoutes.post(
  "/sign-in",
  zValidator("json", signInEmailSchema),
  async (c) => {
    const body = c.req.valid("json");
    const origin =
      c.req.header("origin") ||
      (c.req.header("host")
        ? `${c.req.header("x-forwarded-proto") || "http"}://${c.req.header("host")}`
        : "http://localhost:4000");

    const result = await AuthService.signIn(body, { origin });

    if (result.setCookieHeader) {
      c.header("Set-Cookie", result.setCookieHeader);
    }

    return sendSuccess(
      c,
      {
        user: result.user,
        token: result.token,
      },
      200,
      "Signed in successfully",
    );
  },
);

/**
 * GET /auth/me
 * Retrieve the current authenticated user from session cookie or bearer token.
 */
authRoutes.get("/me", async (c) => {
  const cookie = c.req.header("cookie");
  const authorization = c.req.header("authorization");

  if (!cookie && !authorization) {
    throw new UnauthorizedError(
      "Authentication required: no session cookie or token provided",
    );
  }

  const origin = c.req.header("origin") || "http://localhost:4000";
  const headers: Record<string, string> = {
    origin,
  };
  if (cookie) headers["cookie"] = cookie;
  if (authorization) headers["authorization"] = authorization;

  const session = await AuthService.getSession(headers);

  if (!session?.user) {
    throw new UnauthorizedError("No active user session found");
  }

  return sendSuccess(c, session, 200, "Current user retrieved");
});
