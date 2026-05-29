import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  IAdminProfileDocument,
  IAdminProfilePaginateModel,
} from "./admin.types";

const AdminProfileSchema = new Schema<IAdminProfileDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
);

AdminProfileSchema.plugin(mongoosePaginate);

export const AdminProfile = model<
  IAdminProfileDocument,
  IAdminProfilePaginateModel
>("AdminProfile", AdminProfileSchema);
