import { CategoryListQuery } from "../category.types";
import { categoryRepository } from "./category.repository";

export const categoryService = {
  async getAll(query: CategoryListQuery) {
    const { page, limit, name } = query;

    const result = await categoryRepository.getAll({
      page,
      limit,
      name,
    });

    return result;
  },
};
