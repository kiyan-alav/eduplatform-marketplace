import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Enum Types ────────────────────────────────────────────
export enum LevelType {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

// ! ─── Filter Types ────────────────────────────────────────────
export interface ICourseFilter extends CustomQueryOptions {
  title?: string;
  instructor?: string;
  category?: string;
  level?: LevelType;
  isPublished?: boolean;
}

// ! ─── Core Types ────────────────────────────────────────────
export interface ICourse {
  title: string;
  description: string;
  instructor: Types.ObjectId;
  price: number;
  level: LevelType;
  category: Types.ObjectId;
  isPublished: boolean;
  cover: string | null;
  avgRating: number;
  ratingCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICourseDocument extends ICourse, Document {}

export interface ICoursePaginateModel extends PaginateModel<ICourseDocument> {}
