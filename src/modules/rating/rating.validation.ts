import { z } from "zod";

export const createRatingSchema = z
  .object({
    courseId: z.string().min(1, "Course id is required"),
    userId: z.string().min(1, "User id is required"),
    score: z.coerce
      .number()
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    description: z.string().optional(),
  })
  .strict();
