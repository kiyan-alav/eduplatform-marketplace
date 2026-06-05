import createHttpError from "http-errors";
import { buildQueryFilters } from "../../../utils/query-builder";
import { courseFilterConfig } from "../course.filter";
import { Course } from "../course.model";
import { ICourseFilter } from "../course.types";

export const courseService = {
  async getAll(filters: ICourseFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      courseFilterConfig,
    );

    mongoFilter.isPublished = true;

    const result = await Course.paginate(mongoFilter, options);

    return result;
  },

  async getOne(id: string) {
    const course = await Course.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return course;
  },
};
