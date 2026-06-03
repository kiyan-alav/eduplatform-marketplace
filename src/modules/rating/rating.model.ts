import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { updateCourseRating } from "../../utils/updateCourseRating";
import { IRatingDocument, IRatingPaginateModel } from "./rating.types";

const RatingSchema = new Schema<IRatingDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
    },
    score: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      default: 5,
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

RatingSchema.plugin(mongoosePaginate);

RatingSchema.index({ course: 1 });
RatingSchema.index({ course: 1, user: 1 }, { unique: true });

RatingSchema.post("save", async function () {
  updateCourseRating(this.course).catch(console.error);
});

RatingSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await updateCourseRating(doc.course).catch(console.error);
  }
});

export const Rating = model<IRatingDocument, IRatingPaginateModel>(
  "Rating",
  RatingSchema,
);
