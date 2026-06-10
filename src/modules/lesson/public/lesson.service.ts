import createHttpError from "http-errors";
import { buildQueryFilters } from "../../../utils/query-builder";
import { lessonFilterConfig } from "../leeson.filter";
import { Lesson } from "../lesson.model";
import { ILessonFilter } from "../lesson.types";

export const lessonService = {
  async getAll(filters: ILessonFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      lessonFilterConfig,
    );
    options.populate = [
      {
        path: "chapter",
        select: "title totalDuration",
        populate: { path: "course", select: "_id title" },
      },
    ];
    options.sort = { order: 1 };

    return Lesson.paginate(mongoFilter, options);
  },

  async getOne(id: string) {
    const lesson = await Lesson.findById(id).populate({
      path: "chapter",
      select: "title totalDuration",
      populate: {
        path: "course",
        select: "_id title",
      },
    });

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    return lesson;
  },
};
