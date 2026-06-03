import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { ILessonDocument, ILessonPaginateModel } from "./lesson.types";

const lessonSchema = new Schema<ILessonDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    chapter: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: [true, "Chapter is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
    },
    videoPath: {
      type: String,
      // required: [true, "Video path is required"],
      default: null,
      trim: true,
    },
    order: {
      type: Number,
      required: [true, "Order value is required"],
    },
  },
  {
    timestamps: true,
  },
);

lessonSchema.plugin(paginate);

export const Lesson = model<ILessonDocument, ILessonPaginateModel>(
  "Lesson",
  lessonSchema,
);
