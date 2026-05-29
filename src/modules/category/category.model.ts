import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { ICategoryDocument, ICategoryPaginateModel } from "./category.types";

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: {
      type: String,
      required: [true, "Category is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

CategorySchema.plugin(mongoosePaginate);

CategorySchema.index({ createdAt: -1 });

export const Category = model<ICategoryDocument, ICategoryPaginateModel>(
  "Category",
  CategorySchema,
);
