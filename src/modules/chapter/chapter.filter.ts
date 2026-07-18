import { z } from "zod";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const ChapterListQuerySchema = BaseListQuerySchema.extend({
  title: z.string().optional(),
  courseId: z.coerce.number().int().positive().optional(),
});
