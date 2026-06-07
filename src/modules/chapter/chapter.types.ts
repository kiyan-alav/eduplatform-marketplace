import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Core Types ────────────────────────────────────────────
export interface IChapter {
  title: string;
  course: Types.ObjectId;
  order: number;
  totalDuration: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IChapterDocument extends IChapter, Document {}

export interface IChapterPaginateModel extends PaginateModel<IChapterDocument> {}

// ! ─── Filter Types ────────────────────────────────────────────
export interface IChapterFilter extends CustomQueryOptions {
  title?: string;
  course?: string;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateChapterRequest {
  title: string;
  course: string;
  order: number;
}

export interface IUpdateChapterRequest {
  title?: string;
  course?: string;
  order?: number;
}
