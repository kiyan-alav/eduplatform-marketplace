import { z } from "zod";

export const PaginationSchema = z.object({
  page: z
    .preprocess((val) => Number(val), z.number().min(1))
    .optional()
    .default(1),
  limit: z
    .preprocess((val) => Number(val), z.number().min(1).max(100))
    .optional()
    .default(10),
  sort: z.string().optional().default("-createdAt"),
});
