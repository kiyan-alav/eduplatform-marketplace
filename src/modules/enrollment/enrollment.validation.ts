import { z } from "zod";

export const createEnrollmentSchema = z
  .object({
    courseId: z.coerce.number("Course id is required").int().positive(),
    paid: z.coerce.number().min(0, "Paid amount must be at least 0"),
    paidAt: z.coerce.date(),
  })
  .strict();
