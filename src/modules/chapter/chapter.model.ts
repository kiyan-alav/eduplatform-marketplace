import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IChapterDocument, IChapterPaginateModel } from "./chapter.types";

const chapterSchema = new Schema<IChapterDocument>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    order: {
      type: Number,
      required: [true, "Order value is required"],
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

chapterSchema.plugin(paginate);

export const Chapter = model<IChapterDocument, IChapterPaginateModel>(
  "Chapter",
  chapterSchema,
);
