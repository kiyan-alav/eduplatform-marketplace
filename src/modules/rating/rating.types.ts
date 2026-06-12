import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Filter Types ────────────────────────────────────────────
export interface IRatingFilter extends CustomQueryOptions {
  isApproved?: boolean;
}

// ! ─── Core Types ────────────────────────────────────────────
export interface IRating {
  user: Types.ObjectId;
  course: Types.ObjectId;
  score: number;
  description: string;
  isApproved: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRatingDocument extends IRating, Document {}

export interface IRatingPaginateModel extends PaginateModel<IRatingDocument> {}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateRatingRequest {
  user: string;
  course: string;
  score: number;
  description?: string;
}
