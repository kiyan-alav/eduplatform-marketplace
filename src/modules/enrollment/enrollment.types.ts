import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Filter Types ────────────────────────────────────────────
export interface IEnrollmentFilter extends CustomQueryOptions {
  course?: string;
}

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

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateEnrollmentRequest {
  student: string;
  course: string;
  paid: number;
  paidAt: Date;
}
