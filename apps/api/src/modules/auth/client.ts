import { createAuthClient, type VanillaBetterAuthClient } from "@neon/auth";
import { getConfig } from "../../config/env.js";

let clientInstance: VanillaBetterAuthClient | null = null;

/**
 * Returns the Neon Auth SDK client initialized with the branch's NEON_AUTH_BASE_URL.
 */
export function getNeonAuthClient(): VanillaBetterAuthClient {
  if (!clientInstance) {
    const config = getConfig();
    clientInstance = createAuthClient(
      config.NEON_AUTH_BASE_URL,
    ) as VanillaBetterAuthClient;
  }
  return clientInstance;
}

export const authClient: VanillaBetterAuthClient = new Proxy(
  {} as VanillaBetterAuthClient,
  {
    get(_target, prop) {
      const instance = getNeonAuthClient();
      return (instance as any)[prop];
    },
  },
);
