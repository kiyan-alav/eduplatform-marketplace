import { z } from "zod";
import { PaginationSchema } from "../../utils/baseFilterSchema";
import { FilterConfig } from "../../utils/query-builder";
import { ILessonFilter } from "./lesson.types";

export const lessonFilterConfig: FilterConfig<ILessonFilter> = {
  searchable: ["title"],
  regex: ["title"],
  exact: ["chapter", "course"],
  enumList: [],
};

export const LessonListQuerySchema = PaginationSchema.extend({
  title: z.string().optional(),
  chapter: z.string().optional(),
  course: z.string().optional(),
});
