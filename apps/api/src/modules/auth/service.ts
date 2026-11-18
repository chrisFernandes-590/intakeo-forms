import { authClient } from "./client.js";
import type { SignUpEmailInput, SignInEmailInput } from "./schemas.js";
import {
  BadRequestError,
  UnauthorizedError,
} from "../../common/errors/index.js";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  emailVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: unknown;
}

export interface AuthResult {
  user: AuthUser;
  token?: string | null;
  setCookieHeader?: string | null;
}

export interface UserSessionData {
  user: AuthUser;
  session: {
    id: string;
    userId: string;
    expiresAt: string | Date;
    token?: string;
    [key: string]: unknown;
  };
}

export class AuthService {
  /**
   * Register a new user with email and password via Neon Managed Better Auth.
   */
  public static async signUp(
    input: SignUpEmailInput,
    options?: { origin?: string },
  ): Promise<AuthResult> {
    let setCookieHeader: string | null = null;
    const origin = options?.origin || "http://localhost:4000";

    const { data, error } = await authClient.signUp.email({
      email: input.email,
      password: input.password,
      name: input.name,
      fetchOptions: {
        headers: {
          origin,
        },
        onResponse(ctx: { response: Response }) {
          setCookieHeader = ctx.response.headers.get("set-cookie");
        },
      },
    });

    if (error || !data) {
      throw new BadRequestError(
        error?.message || "Failed to sign up with email and password",
        { code: error?.code, status: error?.status },
      );
    }

    return {
      user: data.user as unknown as AuthUser,
      token: data.token,
      setCookieHeader,
    };
  }

  /**
   * Authenticate an existing user with email and password.
   */
  public static async signIn(
    input: SignInEmailInput,
    options?: { origin?: string },
  ): Promise<AuthResult> {
    let setCookieHeader: string | null = null;
    const origin = options?.origin || "http://localhost:4000";

    const { data, error } = await authClient.signIn.email({
      email: input.email,
      password: input.password,
      fetchOptions: {
        headers: {
          origin,
        },
        onResponse(ctx: { response: Response }) {
          setCookieHeader = ctx.response.headers.get("set-cookie");
        },
      },
    });

    if (error || !data) {
      throw new UnauthorizedError(
        error?.message || "Invalid email or password",
        { code: error?.code, status: error?.status },
      );
    }

    return {
      user: data.user as unknown as AuthUser,
      token: data.token,
      setCookieHeader,
    };
  }

  /**
   * Retrieve current user session from incoming request headers (cookie or bearer token).
   */
  public static async getSession(
    headers: HeadersInit,
  ): Promise<UserSessionData | null> {
    const { data, error } = await authClient.getSession({
      fetchOptions: {
        headers,
      },
    });

    if (error) {
      throw new UnauthorizedError(
        error.message || "Failed to retrieve active session",
        { code: error.code },
      );
    }

    if (!data || !("user" in data)) {
      return null;
    }

    return data as unknown as UserSessionData;
  }
}
