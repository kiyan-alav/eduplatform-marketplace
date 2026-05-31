import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Filter Types ────────────────────────────────────────────
export interface IRatingFilter extends CustomQueryOptions {
  course?: string;
}

// ! ─── Core Types ────────────────────────────────────────────
export interface IRating {
  user: Types.ObjectId;
  course: Types.ObjectId;
  score: number;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRatingDocument extends IRating, Document {}

export interface IRatingPaginateModel extends PaginateModel<IRatingDocument> {}
