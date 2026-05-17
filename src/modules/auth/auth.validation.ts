import { z } from "zod";

const phoneRegex = /^09\d{9}$/;

export const registerSchema = z
  .object({
    email: z.email("Email is required"),
    phone: z.string("Phone is required").regex(phoneRegex, "Invalid phone"),
    fullName: z.string("Fullname is required"),
    password: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters"),
    confirm: z.string("Confirm password is required"),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords do not match",
    path: ["confirm"],
  });

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Identifier is required")
    .refine(
      (value) => {
        const isEmail = z.email().safeParse(value).success;
        const isPhone = phoneRegex.test(value);

        return isEmail || isPhone;
      },
      {
        message: "Identifier must be a valid email or phone number",
      },
    ),
  password: z.string("Password is required"),
});
