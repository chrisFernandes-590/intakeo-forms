import { validateFormSchema } from "@app/engine";
import { formatWorkspaceSlug } from "@app/shared";
import { describe, expect, it } from "vitest";
import { App } from "./App.js";

describe("apps/web", () => {
  it("resolves shared and engine path aliases", () => {
    expect(formatWorkspaceSlug("Web App")).toBe("web-app");
    expect(validateFormSchema({ title: "Form" })).toBe(true);
  });

  it("exports App component", () => {
    expect(App).toBeDefined();
  });
});
