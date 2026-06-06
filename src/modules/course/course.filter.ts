import { z } from "zod";
import { PaginationSchema } from "../../utils/paginationSchema";
import { FilterConfig } from "../../utils/query-builder";
import { ICourseFilter, LevelType } from "./course.types";

export const courseFilterConfig: FilterConfig<ICourseFilter> = {
  searchable: ["title"],
  regex: ["title"],
  exact: ["level", "isPublished", "instructor", "category"],
  enumList: [],
};

export const CourseListQuerySchema = PaginationSchema.extend({
  title: z.string().optional(),
  instructor: z.string().optional(),
  category: z.string().optional(),
  level: z
    .enum([LevelType.BEGINNER, LevelType.INTERMEDIATE, LevelType.ADVANCED])
    .optional(),
  isPublished: z.coerce.boolean().optional(),
});
