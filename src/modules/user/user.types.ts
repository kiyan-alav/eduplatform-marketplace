import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Enum Types ────────────────────────────────────────────
export enum UserRole {
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
}

// ! ─── Filter Types ────────────────────────────────────────────
export interface IUserFilter extends CustomQueryOptions {
  email?: string;
  phone?: string;
  fullName?: string;
  roles?: UserRole[];
}

// ! ─── Core Types ────────────────────────────────────────────
export interface IBaseUser {
  email: string;
  phone: string;
  fullName: string;
  passwordHash: string;
  roles: UserRole[];
  avatar: string | null;
  studentProfile: Types.ObjectId | null;
  instructorProfile: Types.ObjectId | null;
  adminProfile: Types.ObjectId | null;
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBaseUserDocument extends IBaseUser, Document {}

export interface IBaseUserPaginateModel extends PaginateModel<IBaseUserDocument> {}
