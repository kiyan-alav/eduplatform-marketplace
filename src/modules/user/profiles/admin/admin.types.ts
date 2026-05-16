import { Document, PaginateModel, Types } from "mongoose";

// ! ─── Core Types ────────────────────────────────────────────
export interface IAdminProfile {
  user: Types.ObjectId;
}

export interface IAdminProfileDocument extends IAdminProfile, Document {}

export interface IAdminProfilePaginateModel extends PaginateModel<IAdminProfileDocument> {}
