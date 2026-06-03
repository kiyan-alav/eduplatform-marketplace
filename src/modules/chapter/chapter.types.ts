import { Document, PaginateModel, Types } from "mongoose";

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
