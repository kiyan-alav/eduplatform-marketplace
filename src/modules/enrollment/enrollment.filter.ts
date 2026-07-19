import { z } from "zod";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const EnrollmentListQuerySchema = BaseListQuerySchema.extend({
  courseId: z.coerce.number().int().positive().optional(),
  studentId: z.coerce.number().int().positive().optional(),
});
