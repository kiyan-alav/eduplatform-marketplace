import { z } from "zod";
import { LevelType } from "../../generated/prisma/enums";

export const createAdminCourseSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    instructorId: z.coerce.number("Instructor id is required").int().positive(),
    price: z.coerce.number().min(0, "Price cannot be negative").default(0),
    level: z.enum(Object.values(LevelType), "Level is required"),
    categoryId: z.coerce.number("Category is required").int().positive(),
  })
  .strict();

export const updateAdminCourseSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    instructorId: z.coerce.number().int().positive().optional(),
    price: z.coerce.number().optional(),
    level: z.enum(Object.values(LevelType)).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
  })
  .strict();

export const createInstructorCourseSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price cannot be negative").default(0),
    level: z.enum(Object.values(LevelType), "Level is required"),
    categoryId: z.coerce.number("Category is required").int().positive(),
  })
  .strict();

export const updateInstructorCourseSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    level: z.enum(Object.values(LevelType)).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
  })
  .strict();
