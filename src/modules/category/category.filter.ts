import { z } from "zod";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const CategoryListQuerySchema = BaseListQuerySchema.extend({
  name: z.string().optional(),
});
