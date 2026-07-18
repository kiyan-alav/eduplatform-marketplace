import createHttpError from "http-errors";
import { CourseListQuery } from "../course.types";
import { courseRepository } from "./course.repository";

export const courseService = {
  async getAll(query: CourseListQuery) {
    return courseRepository.getAll(query);
  },

  async getOne(id: number) {
    const course = await courseRepository.findByIdWithRelations(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return course;
  },
};
