import { describe, expect, it } from "vitest";
import { evaluateSubmission, type FormSchema, validateFormSchema } from "./index.js";

describe("packages/engine", () => {
  const schema: FormSchema = {
    id: "test-form",
    title: "Test Form",
    fields: [
      { id: "email", label: "Email", type: "email", required: true },
      { id: "note", label: "Note", type: "text", required: false },
    ],
  };

  it("validates form schema structure", () => {
    expect(validateFormSchema(schema)).toBe(true);
    expect(validateFormSchema(null)).toBe(false);
  });

  it("evaluates submissions correctly", () => {
    const invalid = evaluateSubmission(schema, { note: "hello" });
    expect(invalid.valid).toBe(false);
    expect(invalid.errors.email).toBe("Email is required");

    const valid = evaluateSubmission(schema, { email: "user@example.com" });
    expect(valid.valid).toBe(true);
    expect(Object.keys(valid.errors).length).toBe(0);
  });
});
