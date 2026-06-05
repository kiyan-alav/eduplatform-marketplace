import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import "../course/course.model";
import "../user/profiles/student/student.model";
import {
  IEnrollmentDocument,
  IEnrollmentPaginateModel,
} from "./enrollment.types";

const enrollmentSchema = new Schema<IEnrollmentDocument>(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "StudentProfile",
      required: [true, "User is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    paid: {
      type: Number,
      required: [true, "Paid value is required"],
    },
    paidAt: {
      type: Date,
      required: [true, "Paid date is required"],
    },
  },
  {
    timestamps: true,
  },
);

enrollmentSchema.plugin(paginate);

export const Enrollment = model<IEnrollmentDocument, IEnrollmentPaginateModel>(
  "Enrollment",
  enrollmentSchema,
);
