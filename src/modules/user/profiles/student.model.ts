import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  IStudentProfileDocument,
  IStudentProfilePaginateModel,
} from "../student.types";

const StudentProfileSchema = new Schema<IStudentProfileDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    interests: [
      {
        type: String,
        trim: true,
      },
    ],
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
