import { describe, expect, it } from "vitest";
import { formatWorkspaceSlug, loadConfig } from "./index.js";

describe("packages/shared", () => {
  it("formatWorkspaceSlug formats strings properly", () => {
    expect(formatWorkspaceSlug("Demo Workspace")).toBe("demo-workspace");
    expect(formatWorkspaceSlug("  My Special Form!  ")).toBe("my-special-form");
  });

  it("loadConfig returns valid config for valid env", () => {
    const config = loadConfig({
      NODE_ENV: "test",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/formflow",
      REDIS_URL: "redis://localhost:6379",
      SMTP_HOST: "localhost",
      SMTP_PORT: 1025,
      SESSION_SECRET: "12345678901234567890123456789012",
    });

    expect(config.NODE_ENV).toBe("test");
    expect(config.DATABASE_URL).toContain("formflow");
    expect(config.SESSION_SECRET.length).toBeGreaterThanOrEqual(32);
  });
});
