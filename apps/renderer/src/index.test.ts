import { describe, expect, it } from "vitest";
import { getBrowserStub } from "./index.js";

describe("apps/renderer", () => {
  it("exports browser stub interface", () => {
    expect(getBrowserStub()).toBeNull();
  });
});
