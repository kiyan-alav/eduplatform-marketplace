import createHttpError from "http-errors";
import { LessonListQuery } from "../lesson.types";
import { lessonRepository } from "./lesson.repository";

export const lessonService = {
  async getAll(params: LessonListQuery) {
    return lessonRepository.getAll(params);
  },

  async getOne(id: number) {
    const lesson = await lessonRepository.findById(id);

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    return lesson;
  },
};
