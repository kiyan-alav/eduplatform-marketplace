import { z } from "zod";
import { PaginationParams } from "../../types/buildPagination";
import { LessonListQuerySchema } from "./lesson.filter";

// ! ─── Filter Types ────────────────────────────────────────────
export type LessonListQuery = z.infer<typeof LessonListQuerySchema>;

export interface GetAllLessonsQuery extends PaginationParams {
  title?: string;
  courseId?: number;
  chapterId?: number;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateLessonRequest {
  title: string;
  chapterId: number;
  duration: number;
  // videoPath?: string;
  order: number;
}

export interface IUpdateLessonRequest {
  title?: string;
  chapterId?: number;
  duration?: number;
  // videoPath?: string;
  order?: number;
}
