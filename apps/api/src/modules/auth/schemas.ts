import { z } from "zod";

export const signUpEmailSchema = z.object({
  email: z.string().email("A valid email address is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
});

export const signInEmailSchema = z.object({
  email: z.string().email("A valid email address is required"),
  password: z.string().min(1, "Password is required"),
});

export type SignUpEmailInput = z.infer<typeof signUpEmailSchema>;
export type SignInEmailInput = z.infer<typeof signInEmailSchema>;
