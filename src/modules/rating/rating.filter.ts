import { z } from "zod";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const RatingListQuerySchema = BaseListQuerySchema.extend({
  courseId: z.coerce.number().int().positive().optional(),
  isApproved: z.coerce.boolean().optional(),
});
