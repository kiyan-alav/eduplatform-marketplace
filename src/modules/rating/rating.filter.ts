import { z } from "zod";
import { PaginationSchema } from "../../utils/baseFilterSchema";
import { FilterConfig } from "../../utils/query-builder";
import { IRatingFilter } from "./rating.types";

export const ratingFilterConfig: FilterConfig<IRatingFilter> = {
  searchable: [],
  regex: [],
  exact: ["isApproved"],
  enumList: [],
};

export const RatingListQuerySchema = PaginationSchema.extend({
  isApproved: z.coerce.boolean().optional(),
});
