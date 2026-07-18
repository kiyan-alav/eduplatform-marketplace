import { z } from "zod";
import { PaginationSchema } from "../../utils/baseFilterSchema";
import { FilterConfig } from "../../utils/query-builder";
import { ICategoryFilter } from "./category.types";

export const categoryFilterConfig: FilterConfig<ICategoryFilter> = {
  searchable: ["name"],
  regex: [],
  exact: [],
  enumList: [],
};

export const CategoryListQuerySchema = PaginationSchema.extend({
  name: z.string().optional(),
});
