import createHttpError from "http-errors";
import slugify from "slugify";
import {
  CategoryListQuery,
  ICreateCategoryRequest,
  IUpdateCategoryRequest,
} from "../category.types";
import { adminCategoryRepository } from "./category.admin.repository";

export const categoryAdminService = {
  async getAll(query: CategoryListQuery) {
    const { page, limit, name } = query;

    const result = await adminCategoryRepository.getAll({
      page,
      limit,
      name,
    });

    return result;
  },

  async create(data: ICreateCategoryRequest) {
    const name = data.name.trim();

    const rawSlug = data?.slug?.trim() || name;

    const slug = slugify(rawSlug, {
      lower: true,
      strict: true,
      trim: true,
    });

    const isExist = await adminCategoryRepository.findByNameOrSlug(name, slug);

    if (isExist) {
      throw createHttpError(409, "Category exists!");
    }

    return await adminCategoryRepository.create({
      name,
      slug,
    });
  },

  async update(id: number, data: IUpdateCategoryRequest) {
    const category = await adminCategoryRepository.findById(id);

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

    const conflict = await adminCategoryRepository.findByNameOrSlugExceptId(
      id,
      updateDoc.name,
      updateDoc.slug,
    );

    if (conflict) {
      throw createHttpError(409, "Category exists!");
    }

    return adminCategoryRepository.update(id, updateDoc);
  },

  async delete(id: number) {
    const category = await adminCategoryRepository.findById(id);

    if (!category) {
      throw createHttpError(404, "Category not found!");
    }

    return await adminCategoryRepository.delete(id);
  },
};
