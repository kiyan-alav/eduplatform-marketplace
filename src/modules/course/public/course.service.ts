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

    options.populate = [
      { path: "category", select: "name" },
      {
        path: "instructor",
        select: "verification.isVerified verification.status _id",
        populate: {
          path: "user",
          select: "fullName email phone _id avatar",
        },
      },
    ];

    const result = await Course.paginate(mongoFilter, options);

    return result;
  },

  async getOne(id: string) {
    const course = await Course.findById(id).populate([
      { path: "category", select: "-createdAt -updatedAt -__v" },
      {
        path: "instructor",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "user",
          select: "-createdAt -updatedAt -__v",
        },
      },
    ]);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return course;
  },
};
