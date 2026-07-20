import createHttpError from "http-errors";
import {
  GetAllEnrollmentsQuery,
  ICreateEnrollmentRequest,
} from "../enrollment.types";
import { enrollmentUserRepository } from "./enrollment.user.repository";

export const enrollmentUserService = {
  async getAll(userId: number, filter: GetAllEnrollmentsQuery) {
    const student =
      await enrollmentUserRepository.findStudentProfileByUserId(userId);
    if (!student) throw createHttpError(404, "Student profile not found");

    return enrollmentUserRepository.getAll(filter, student.id);
  },

  async getOne(userId: number, courseId: number) {
    const student =
      await enrollmentUserRepository.findStudentProfileByUserId(userId);
    if (!student) throw createHttpError(404, "Student profile not found");

    const enrollment = await enrollmentUserRepository.findById(
      student.id,
      courseId,
    );
    if (!enrollment) throw createHttpError(404, "Enrollment not found!");

    return enrollment;
  },

  async create(userId: number, data: ICreateEnrollmentRequest) {
    const student =
      await enrollmentUserRepository.findStudentProfileByUserId(userId);
    if (!student) throw createHttpError(404, "Student profile not found");

    const course = await enrollmentUserRepository.findCourseById(data.courseId);
    if (!course) throw createHttpError(404, "Course not found");

    const existing = await enrollmentUserRepository.findById(
      student.id,
      data.courseId,
    );
    if (existing) {
      throw createHttpError(409, "You are already enrolled in this course");
    }

    return enrollmentUserRepository.create({
      studentId: student.id,
      courseId: data.courseId,
      paid: data.paid,
      paidAt: data.paidAt,
    });
  },
};
