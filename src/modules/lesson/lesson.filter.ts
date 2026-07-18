import { z } from "zod";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const LessonListQuerySchema = BaseListQuerySchema.extend({
  title: z.string().optional(),
  chapterId: z.coerce.number().int().positive().optional(),
  courseId: z.coerce.number().int().positive().optional(),
});
