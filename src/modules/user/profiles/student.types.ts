import { Document, PaginateModel, Types } from "mongoose";

// ! ─── Core Types ────────────────────────────────────────────
export interface IStudentProfile {
  user: Types.ObjectId;
  enrolledCourses: Types.ObjectId[];
  interests: string[];
}

export interface IStudentProfileDocument extends IStudentProfile, Document {}

export interface IStudentProfilePaginateModel extends PaginateModel<IStudentProfileDocument> {}
