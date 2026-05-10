import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.email("Email is required"),
    phone: z.string("Phone is required").regex(/^09\d{9}$/, "Invalid phone"),
    fullName: z.string("fullname is required"),
    password: z
      .string("password is required")
      .min(6, "Password must be at least 6 characters"),
    confirm: z.string("confirm password is required"),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords do not match",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  identifier: z.string("identifier is required"),
  password: z.string("password is required"),
});
