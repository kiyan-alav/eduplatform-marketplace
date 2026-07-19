import { z } from "zod";

export const createRatingSchema = z
  .object({
    courseId: z.coerce.number("Course id is required").int().positive(),
    score: z.coerce
      .number()
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    description: z.string().optional(),
  })
  .strict();
