import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  IStudentProfileDocument,
  IStudentProfilePaginateModel,
} from "./student.types";

const StudentProfileSchema = new Schema<IStudentProfileDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    enrolledCourses: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Course",
        },
      ],
      default: [],
    },
    interests: {
      type: [
        {
          type: String,
          trim: true,
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

StudentProfileSchema.plugin(mongoosePaginate);

export const StudentProfile = model<
  IStudentProfileDocument,
  IStudentProfilePaginateModel
>("StudentProfile", StudentProfileSchema);
