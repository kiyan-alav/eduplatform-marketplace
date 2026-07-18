import createHttpError from "http-errors";
import {
  GetAllCourseQuery,
  ICreateCourseRequest,
  IUpdateCourseRequest,
} from "../course.types";
import { adminCourseRepository } from "./course.admin.repository";

export const courseAdminService = {
  async getAll(query: GetAllCourseQuery) {
    return adminCourseRepository.getAll(query);
  },

  async getOne(id: number) {
    const course = await adminCourseRepository.findByIdWithRelations(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return course;
  },

  async create(data: ICreateCourseRequest, cover?: string) {
    return adminCourseRepository.create(data, cover);
  },

  async edit(id: number, data: IUpdateCourseRequest, cover?: string) {
    const course = await adminCourseRepository.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return adminCourseRepository.update(id, data, cover);
  },

  async delete(id: number) {
    const course = await adminCourseRepository.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return adminCourseRepository.deleteWithRelations(id);
  },

  async togglePublish(id: number) {
    const course = await adminCourseRepository.togglePublish(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return course;
  },
};
