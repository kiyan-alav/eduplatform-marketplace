import { Document, PaginateModel, Types } from "mongoose";

// ! ─── Enum Types ────────────────────────────────────────────
export enum InstructorRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ! ─── Core Types ────────────────────────────────────────────
export interface IInstructorProfile {
  user: Types.ObjectId;
  bio: string;
  expertise: string[];
  socialLinks: {
    website?: string;
    instagram?: string;
    linkedin?: string;
  };
  verification: {
    isVerified: boolean;
    documents: string[];
    status: InstructorRequestStatus;
  };
  payoutInfo: {
    bankAccount?: string;
    cardNumber?: string;
    shaba?: string;
  };
  createdCourses: Types.ObjectId[];
}

export interface IInstructorProfileDocument
  extends IInstructorProfile, Document {}

export interface IInstructorProfilePaginateModel extends PaginateModel<IInstructorProfileDocument> {}
