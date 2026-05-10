import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  IInstructorProfileDocument,
  IInstructorProfilePaginateModel,
  InstructorRequestStatus,
} from "./instructor.types";

const InstructorProfileSchema = new Schema<IInstructorProfileDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      trim: true,
      default: null,
      maxLength: 1000,
    },
    expertise: [
      {
        type: String,
        trim: true,
      },
    ],
    socialLinks: {
      website: String,
      instagram: String,
      linkedin: String,
    },
    verification: {
      isVerified: {
        type: Boolean,
        default: false,
      },
      documents: [
        {
          type: String,
        },
      ],
      status: {
        type: String,
        enum: Object.values(InstructorRequestStatus),
        default: InstructorRequestStatus.PENDING,
        index: true,
      },
    },
    payoutInfo: {
      bankAccount: String,
      cardNumber: String,
      shaba: String,
    },
    createdCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  },
);

InstructorProfileSchema.plugin(mongoosePaginate);

export const InstructorProfile = model<
  IInstructorProfileDocument,
  IInstructorProfilePaginateModel
>("InstructorProfile", InstructorProfileSchema);
