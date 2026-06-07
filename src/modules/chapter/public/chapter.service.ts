import createHttpError from "http-errors";
import { buildQueryFilters } from "../../../utils/query-builder";
import { chapterFilterConfig } from "../chapter.filter";
import { Chapter } from "../chapter.model";
import { IChapterFilter } from "../chapter.types";

export const chapterService = {
  async getAll(filters: IChapterFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      chapterFilterConfig,
    );
    options.populate = [{ path: "course", select: "title" }];
    options.sort = { order: 1 };

    return Chapter.paginate(mongoFilter, options);
  },

  async getOne(id: string) {
    const chapter = await Chapter.findById(id).populate({
      path: "course",
      select: "title",
    });

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    return chapter;
  },
};
