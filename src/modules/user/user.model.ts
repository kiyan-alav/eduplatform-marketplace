import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  IBaseUserDocument,
  IBaseUserPaginateModel,
  UserRole,
} from "./user.types";

const BaseUserSchema = new Schema<IBaseUserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      match: [/^09\d{9}$/, "Invalid phone"],
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
      minLength: [2, "Fullname must be at least 2 character"],
      maxLength: [50, "Fullname cannot be more than 50 character"],
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 character"],
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.STUDENT],
      required: [true, "Role must be defined!"],
      index: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    studentProfile: { type: Schema.Types.ObjectId, ref: "StudentProfile" },
    instructorProfile: {
      type: Schema.Types.ObjectId,
      ref: "InstructorProfile",
    },
    adminProfile: { type: Schema.Types.ObjectId, ref: "AdminProfile" },
  },
  {
    timestamps: true,
  },
);

BaseUserSchema.plugin(mongoosePaginate);

BaseUserSchema.index({ createdAt: -1 });
BaseUserSchema.index({ roles: 1, createdAt: -1 });

export const User = model<IBaseUserDocument, IBaseUserPaginateModel>(
  "User",
  BaseUserSchema,
);
