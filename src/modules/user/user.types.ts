import { z } from "zod";
import {
  InstructorRequestStatus,
  UserRole,
} from "../../generated/prisma/enums";
import {
  InstructorRequestQuerySchema,
  UserListQuerySchema,
} from "./user.filter";

export type UserListQuery = z.infer<typeof UserListQuerySchema>;

export type InstructorRequestQuery = z.infer<
  typeof InstructorRequestQuerySchema
>;

export type GetAllUserQuery = {
  page: number;
  limit: number;
  email?: string;
  phone?: string;
  role?: string;
};

export type GetAllInstructorRequestQuery = {
  page: number;
  limit: number;
  email?: string;
  phone?: string;
};

export interface UpdateInstructorRequestStatus {
  userId: number;
  status: InstructorRequestStatus;
  isVerified: boolean;
  roles: UserRole[];
}
