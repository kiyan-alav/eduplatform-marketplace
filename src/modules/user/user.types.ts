import { z } from "zod";
import {
  InstructorRequestStatus,
  UserRole,
} from "../../generated/prisma/enums";
import {
  InstructorRequestQuerySchema,
  UserListQuerySchema,
} from "./user.filter";
import { PaginationParams } from "../../types/buildPagination";

// ! ─── Filter Types ────────────────────────────────────────────
export type UserListQuery = z.infer<typeof UserListQuerySchema>;

export type InstructorRequestQuery = z.infer<
  typeof InstructorRequestQuerySchema
>;

export interface GetAllUserQuery extends PaginationParams {
  email?: string;
  phone?: string;
  role?: string;
};

export interface GetAllInstructorRequestQuery extends PaginationParams {
  email?: string;
  phone?: string;
};

// ! ─── Request Types ────────────────────────────────────────────
export interface UpdateInstructorRequestStatus {
  userId: number;
  status: InstructorRequestStatus;
  isVerified: boolean;
  roles: UserRole[];
}
