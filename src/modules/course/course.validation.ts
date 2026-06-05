import { z } from "zod";
import { LevelType } from "./course.types";

export const createAdminCourseSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    instructor: z.string().min(1, "Instructor id is required"),
    price: z.coerce.number().min(0, "Price cannot be negative").default(0),
    level: z.enum(Object.values(LevelType), "Level is required"),
    category: z.string().min(1, "Category is required"),
  })
  .strict();

export const updateAdminCourseSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    instructor: z.string().optional(),
    price: z.coerce.number().optional(),
    level: z.enum(Object.values(LevelType)).optional(),
    category: z.string().optional(),
  })
  .strict();

export const createInstructorCourseSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price cannot be negative").default(0),
    level: z.enum(Object.values(LevelType), "Level is required"),
    category: z.string().min(1, "Category is required"),
  })
  .strict();

export const updateInstructorCourseSchema = z
  .object({
    title: z.string().optional(),
    description: z.string().optional(),
    price: z.coerce.number().optional(),
    level: z.enum(Object.values(LevelType)).optional(),
    category: z.string().optional(),
  })
  .strict();
