import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  ICourseDocument,
  ICoursePaginateModel,
  LevelType,
} from "./course.types";

const CourseSchema = new Schema<ICourseDocument>(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    price: {
      type: Number,
      min: [0, "Price cannot be negative"],
      default: 0,
    },
    level: {
      type: String,
      enum: Object.values(LevelType),
      default: LevelType.BEGINNER,
      required: [true, "Level must be defined!"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    cover: {
      type: String,
      default: null,
    },
    avgRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

CourseSchema.plugin(mongoosePaginate);

CourseSchema.index({ isPublished: 1, createdAt: -1 });
CourseSchema.index({ isPublished: 1, level: 1, createdAt: -1 });
CourseSchema.index({ isPublished: 1, category: 1, createdAt: -1 });
CourseSchema.index({ instructor: 1, createdAt: -1 });

export const Course = model<ICourseDocument, ICoursePaginateModel>(
  "Course",
  CourseSchema,
);
