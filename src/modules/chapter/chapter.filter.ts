import { z } from "zod";
import { PaginationSchema } from "../../utils/paginationSchema";
import { FilterConfig } from "../../utils/query-builder";
import { IChapterFilter } from "./chapter.types";

export const chapterFilterConfig: FilterConfig<IChapterFilter> = {
  searchable: ["title"],
  regex: ["title"],
  exact: ["course"],
  enumList: [],
};

export const ChapterListQuerySchema = PaginationSchema.extend({
  title: z.string().optional(),
  course: z.string().optional(),
});
