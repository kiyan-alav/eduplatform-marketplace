import { z } from "zod";
import { LevelType } from "../../generated/prisma/enums";
import { PaginationParams } from "../../types/buildPagination";
import { CourseListQuerySchema } from "./course.filter";

// ! ─── Filter Types ────────────────────────────────────────────
export type CourseListQuery = z.infer<typeof CourseListQuerySchema>;

export interface GetAllCourseQuery extends PaginationParams {
  title?: string;
  instructorId?: number;
  categoryId?: number;
  level?: LevelType;
  isPublished?: boolean;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateCourseRequest {
  title: string;
  description: string;
  instructor: number;
  price: number;
  level: LevelType;
  category: number;
}

export interface IUpdateCourseRequest {
  title?: string;
  description?: string;
  instructor?: number;
  price?: number;
  level?: LevelType;
  category?: number;
}
