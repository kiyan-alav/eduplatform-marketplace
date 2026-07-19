import { z } from "zod";
import { PaginationParams } from "../../types/buildPagination";
import { RatingListQuerySchema } from "./rating.filter";

// ! ─── Filter Types ────────────────────────────────────────────
export type RatingListQuery = z.infer<typeof RatingListQuerySchema>;

export interface GetAllRatingsQuery extends PaginationParams {
  courseId?: number;
  isApproved?: boolean;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateRatingRequest {
  userId: number;
  courseId: number;
  score: number;
  description?: string;
}
