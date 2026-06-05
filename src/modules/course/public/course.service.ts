import createHttpError from "http-errors";
import { Course } from "../course.model";
import { ICourseFilter } from "../course.types";
import { buildQueryFilters } from "../../../utils/query-builder";
import { courseFilterConfig } from "../course.filter";

export const courseService = {
  async getAll(filters: ICourseFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      courseFilterConfig,
    );

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
