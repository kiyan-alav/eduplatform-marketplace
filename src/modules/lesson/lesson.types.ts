import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Core Types ────────────────────────────────────────────
export interface ILesson {
  title: string;
  chapter: Types.ObjectId;
  duration: number;
  videoPath: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ILessonDocument extends ILesson, Document {}

export interface ILessonPaginateModel extends PaginateModel<ILessonDocument> {}

// ! ─── Filter Types ────────────────────────────────────────────
export interface ILessonFilter extends CustomQueryOptions {
  title?: string;
  chapter?: string;
  course?: string;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateLessonRequest {
  title: string;
  chapter: string;
  duration: number;
  // videoPath?: string;
  order: number;
}

export interface IUpdateLessonRequest {
  title?: string;
  chapter?: string;
  duration?: number;
  // videoPath?: string;
  order?: number;
}