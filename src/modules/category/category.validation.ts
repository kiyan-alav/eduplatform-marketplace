import { z } from "zod";

export const createCategorySchema = z
  .object({
    name: z.string("Name is required!"),
    slug: z.string().optional(),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z.string().optional(),
    slug: z.string().optional(),
  })
  .strict();
