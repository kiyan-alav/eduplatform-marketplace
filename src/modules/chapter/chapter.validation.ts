import { z } from "zod";

export const createChapterSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    courseId: z.coerce.number("Course id is required").int().positive(),
    order: z.coerce.number().min(1, "Order must be at least 1"),
  })
  .strict();

export const updateChapterSchema = z
  .object({
    title: z.string().optional(),
    courseId: z.coerce.number().int().positive().optional(),
    order: z.coerce.number().min(1).optional(),
  })
  .strict();
