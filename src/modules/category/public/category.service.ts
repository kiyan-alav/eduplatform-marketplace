import { buildQueryFilters } from "../../../utils/query-builder";
import { categoryFilterConfig } from "../category.filter";
import { Category } from "../category.model";
import { ICategoryFilter } from "../category.types";

export const categoryService = {
  async getAll(filters: ICategoryFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      categoryFilterConfig,
    );

    const result = await Category.paginate(mongoFilter, options);

    return result;
  },
};
