import createHttpError from "http-errors";
import { buildQueryFilters } from "../../../utils/query-builder";
import { enrollmentFilterConfig } from "../enrollment.filter";
import { Enrollment } from "../enrollment.model";
import { IEnrollmentFilter } from "../enrollment.types";

export const enrollmentAdminService = {
  async getAll(filter: IEnrollmentFilter) {
    const { options, mongoFilter } = buildQueryFilters(
      filter,
      enrollmentFilterConfig,
    );

    options.populate = [
      { path: "course", select: "title" },
      {
        path: "student",
        populate: {
          path: "user",
          select: "fullName email phone _id avatar",
        },
      },
    ];

    const result = await Enrollment.paginate(mongoFilter, options);

    return result;
  },

  async getOne(id: string) {
    const enrollment = await Enrollment.findById(id).populate([
      { path: "course", select: "-createdAt -updatedAt -__v" },
      {
        path: "student",
        populate: {
          path: "user",
          select: "-createdAt -updatedAt -__v",
        },
      },
    ]);

    if (!enrollment) {
      throw createHttpError(404, "Enrollment not found");
    }

    return enrollment;
  },
};
