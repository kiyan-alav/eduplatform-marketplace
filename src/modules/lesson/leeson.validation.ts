import { z } from "zod";

export const createLessonSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    chapter: z.string().min(1, "Chapter id is required"),
    order: z.coerce.number().min(1, "Order must be at least 1"),
    duration: z.coerce.number().min(1, "Duration must be at least 1 second"),
  })
  .strict();

export const updateLessonSchema = z
  .object({
    title: z.string().optional(),
    chapter: z.string().optional(),
    order: z.coerce.number().min(1).optional(),
    duration: z.coerce.number().min(1).optional(),
  })
  .strict();
