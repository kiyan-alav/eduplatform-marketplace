import createHttpError from "http-errors";
import slugify from "slugify";
import { buildQueryFilters } from "../../utils/query-builder";
import { categoryFilterConfig } from "./category.filter";
import { Category } from "./category.model";
import {
  ICategoryFilter,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "./category.types";

export const categoryAdminService = {
  async getAll(filters: ICategoryFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      categoryFilterConfig,
    );

    const result = await Category.paginate(mongoFilter, options);

    return result;
  },

  async create(data: ICreateCategoryRequest) {
    const name = data.name.trim();

    const rawSlug = data.slug?.trim() || name;

    console.log(data);

    const slug = slugify(rawSlug, {
      lower: true,
      strict: true,
      trim: true,
    });

    const isExist = await Category.findOne({
      $or: [{ name: name.toLowerCase() }, { slug }],
    });

    if (isExist) {
      throw createHttpError(409, "Category exists!");
    }

    return await Category.create({
      name,
      slug,
    });
  },

  async update(id: string, data: IUpdateCategoryRequest) {
    const category = await Category.findById(id);

    if (!category) {
      throw createHttpError(404, "Category not found!");
    }

    const updateDoc: IUpdateCategoryRequest = {};

    if (typeof data.name === "string") {
      updateDoc.name = data.name.trim();
    }

    if (typeof data.slug === "string" || typeof data.name === "string") {
      const base = (
        data.slug?.trim() ||
        updateDoc.name ||
        category.name
      ).trim();

      updateDoc.slug = slugify(base, {
        lower: true,
        strict: true,
        trim: true,
      });
    }

    if (Object.keys(updateDoc).length === 0) {
      return category;
    }

    if (updateDoc.name || updateDoc.slug) {
      const conditions = [];
      if (updateDoc.name)
        conditions.push({ name: updateDoc.name.toLowerCase() });
      if (updateDoc.slug) conditions.push({ slug: updateDoc.slug });

      const conflict = await Category.findOne({
        _id: { $ne: id },
        $or: conditions,
      });

      if (conflict) throw createHttpError(409, "Category exists!");
    }

    return Category.findByIdAndUpdate(id, updateDoc, {
      returnDocument: "after",
    });
  },

  async delete(id: string) {
    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      throw createHttpError(404, "Category not found!");
    }

    return deleted;
  },
};
