import { z } from "zod";

export const createEnrollmentSchema = z
  .object({
    student: z.string().min(1, "Student id is required"),
    course: z.string().min(1, "Course id is required"),
    paid: z.coerce.number().optional(),
    paidAt: z.date().optional(),
  })
  .strict();
