export interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "email" | "textarea" | "checkbox";
  required?: boolean;
}

export interface FormSchema {
  id: string;
  title: string;
  fields: FormField[];
}

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

export function validateFormSchema(schema: unknown): boolean {
  return typeof schema === "object" && schema !== null && "title" in schema;
}

export function evaluateSubmission(
  schema: FormSchema,
  data: Record<string, unknown>,
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const field of schema.fields) {
    if (field.required && (data[field.id] === undefined || data[field.id] === "")) {
      errors[field.id] = `${field.label} is required`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
