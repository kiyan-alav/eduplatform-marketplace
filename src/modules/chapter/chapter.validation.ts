import { z } from "zod";

export const createChapterSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    course: z.string().min(1, "Course id is required"),
    order: z.coerce.number().min(1, "Order must be at least 1"),
  })
  .strict();

export const updateChapterSchema = z
  .object({
    title: z.string().optional(),
    course: z.string().optional(),
    order: z.coerce.number().min(1).optional(),
  })
  .strict();
