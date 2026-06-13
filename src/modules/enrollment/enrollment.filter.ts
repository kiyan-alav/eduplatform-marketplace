import { z } from "zod";
import { PaginationSchema } from "../../utils/paginationSchema";
import { FilterConfig } from "../../utils/query-builder";
import { IEnrollmentFilter } from "./enrollment.types";

export const enrollmentFilterConfig: FilterConfig<IEnrollmentFilter> = {
  searchable: [],
  regex: [],
  exact: ["course"],
  enumList: [],
};

export const EnrollmentListQuerySchema = PaginationSchema.extend({
  course: z.string().optional(),
});
