import { z } from "zod";

export const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  studentProfile: z
    .object({
      interests: z.array(z.string()).optional(),
    })
    .optional(),
  instructorProfile: z
    .object({
      bio: z.string().max(1000).optional(),
      expertise: z.array(z.string()).optional(),
      socialLinks: z
        .object({
          website: z.url().optional(),
          instagram: z.string().optional(),
          linkedin: z.string().optional(),
        })
        .optional(),
      payoutInfo: z
        .object({
          bankAccount: z.string().optional(),
          cardNumber: z.string().optional(),
          sheba: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string("Current password is required!"),
    newPassword: z
      .string("New password is required")
      .min(6, "Password must be at least 6 characters"),
    confirmNewPassword: z.string("Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    error: "Password do not match",
    path: ["confirmNewPassword"],
  });
