import { Document, PaginateModel, Types } from "mongoose";

// ! ─── Core Types ────────────────────────────────────────────
export interface IEnrollment {
  student: Types.ObjectId;
  course: Types.ObjectId;
  paid: number;
  paidAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEnrollmentDocument extends IEnrollment, Document {}

export interface IEnrollmentPaginateModel extends PaginateModel<IEnrollmentDocument> {}
