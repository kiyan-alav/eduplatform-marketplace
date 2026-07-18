import createHttpError from "http-errors";
import { NotificationType } from "../../../generated/prisma/enums";
import { notificationService } from "../../notification/notification.service";
import {
  CourseListQuery,
  ICreateCourseRequest,
  IUpdateCourseRequest,
} from "../course.types";
import { userCourseRepository } from "./course.user.repository";

export const courseUserService = {
  async getAll(query: CourseListQuery) {
    return userCourseRepository.getAll(query);
  },

  async getOne(id: number, userId?: number) {
    const course = await userCourseRepository.findByIdWithRelations(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    if (userId) {
      const instructor =
        await userCourseRepository.findInstructorProfileByUserId(userId);

      if (!instructor) {
        throw createHttpError(
          403,
          "You are not authorized to access this course!",
        );
      }

      if (course.instructorId !== instructor.id) {
        throw createHttpError(
          403,
          "You are not authorized to access this course!",
        );
      }
    }

    return course;
  },

  async create(data: ICreateCourseRequest, cover?: string) {
    const title = data.title.trim();
    const description = data.description?.trim();

    const instructorProfile =
      await userCourseRepository.findInstructorProfileByUserId(data.instructor);

    if (!instructorProfile) {
      throw createHttpError(
        403,
        "You are not authorized to create courses. You must be an instructor.",
      );
    }

    const course = await userCourseRepository.create({
      title,
      description,
      instructor: data.instructor,
      price: data.price,
      level: data.level,
      category: data.category,
      cover,
    });

    await notificationService.create({
      userId: data.instructor,
      title: "Your course has been created",
      description:
        "After review, your course will be published and available for students.",
      type: NotificationType.SUCCESS,
    });

    return course;
  },

  async edit(id: number, data: IUpdateCourseRequest, cover?: string) {
    const course = await userCourseRepository.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    const updatedCourse = await userCourseRepository.update(id, {
      ...data,
      cover,
    });

    return updatedCourse;
  },

  async delete(id: number) {
    const course = await userCourseRepository.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return userCourseRepository.deleteWithChildren(id);
  },
};
