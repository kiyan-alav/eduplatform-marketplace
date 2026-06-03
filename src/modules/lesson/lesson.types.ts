import { Document, PaginateModel, Types } from "mongoose";

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
