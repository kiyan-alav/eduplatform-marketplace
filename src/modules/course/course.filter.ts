import { z } from "zod";
import { LevelType } from "../../generated/prisma/enums";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const CourseListQuerySchema = BaseListQuerySchema.extend({
  title: z.string().optional(),
  instructorId: z.coerce.number().int().positive().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  level: z.enum(LevelType).optional(),
  isPublished: z.coerce.boolean().optional(),
});
