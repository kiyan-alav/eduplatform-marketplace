import { z } from "zod";
import { PaginationSchema } from "../../utils/paginationSchema";
import { FilterConfig } from "../../utils/query-builder";
import { IRatingFilter } from "./rating.types";

export const ratingFilterConfig: FilterConfig<IRatingFilter> = {
  searchable: ["course"],
  regex: [],
  exact: [],
  enumList: [],
};

export const RatingListQuerySchema = PaginationSchema.extend({
  course: z.string().optional(),
});
