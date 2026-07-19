import { z } from "zod";
import { PaginationParams } from "../../types/buildPagination";
import { EnrollmentListQuerySchema } from "./enrollment.filter";

export type EnrollmentListQuery = z.infer<typeof EnrollmentListQuerySchema>;

export interface GetAllEnrollmentsQuery extends PaginationParams {
  courseId?: number;
  studentId?: number;
}

export interface ICreateEnrollmentRequest {
  studentId: number;
  courseId: number;
  paid: number;
  paidAt: Date;
}
