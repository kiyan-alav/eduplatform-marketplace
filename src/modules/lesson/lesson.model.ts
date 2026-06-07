import { Schema, model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { updateChapterDuration } from "../../utils/updateChapterDuration";
import "../chapter/chapter.model";
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

lessonSchema.post("save", async function () {
  await updateChapterDuration(this.chapter);
});

lessonSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateChapterDuration(doc.chapter);
  }
});

lessonSchema.post("findOneAndUpdate", async function (doc) {
  if (doc) {
    await updateChapterDuration(doc.chapter);
  }
});

export const Lesson = model<ILessonDocument, ILessonPaginateModel>(
  "Lesson",
  lessonSchema,
);
