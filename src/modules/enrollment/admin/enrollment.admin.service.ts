import createHttpError from "http-errors";
import { GetAllEnrollmentsQuery } from "../enrollment.types";
import { enrollmentAdminRepository } from "./enrollment.admin.repository";

export const enrollmentAdminService = {
  async getAll(filters: GetAllEnrollmentsQuery) {
    return enrollmentAdminRepository.getAll(filters);
  },

  async getOne(studentId: number, courseId: number) {
    const enrollment = await enrollmentAdminRepository.findById(studentId, courseId);
    if (!enrollment) throw createHttpError(404, "Enrollment not found!");
    return enrollment;
  },
};
