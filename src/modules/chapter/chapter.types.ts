import { z } from "zod";
import { PaginationParams } from "../../types/buildPagination";
import { ChapterListQuerySchema } from "./chapter.filter";

// ! ─── Filter Types ────────────────────────────────────────────
export type ChapterListQuery = z.infer<typeof ChapterListQuerySchema>;

export interface GetAllChapterQuery extends PaginationParams {
  title?: string;
  courseId?: number;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateChapterRequest {
  title: string;
  courseId: number;
  order: number;
}

export interface IUpdateChapterRequest {
  title?: string;
  courseId?: number;
  order?: number;
}
