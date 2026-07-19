import createHttpError from "http-errors";
import { GetAllLessonsQuery, ICreateLessonRequest, IUpdateLessonRequest } from "../lesson.types";
import { lessonAdminRepository } from "./lesson.admin.repository";

export const lessonAdminService = {
  async getAll(filters: GetAllLessonsQuery) {
    return lessonAdminRepository.getAll(filters);
  },

  async getOne(id: number) {
    const lesson = await lessonAdminRepository.findById(id);
    if (!lesson) throw createHttpError(404, "Lesson not found!");
    return lesson;
  },

  async create(data: ICreateLessonRequest) {
    const chapter = await lessonAdminRepository.findChapterById(data.chapterId);
    if (!chapter) throw createHttpError(404, "Chapter not found!");

    const lastLesson = await lessonAdminRepository.findLastLessonInChapter(data.chapterId);
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    return lessonAdminRepository.createAndRecalculateDuration(data, nextOrder);
  },

  async edit(id: number, data: IUpdateLessonRequest) {
    const lesson = await lessonAdminRepository.findById(id);
    if (!lesson) throw createHttpError(404, "Lesson not found!");

    if (data.chapterId !== undefined) {
      const chapter = await lessonAdminRepository.findChapterById(data.chapterId);
      if (!chapter) throw createHttpError(404, "Chapter not found!");
    }

    return lessonAdminRepository.updateAndRecalculateDuration(id, data);
  },

  async delete(id: number) {
    const lesson = await lessonAdminRepository.findById(id);
    if (!lesson) throw createHttpError(404, "Lesson not found!");

    return lessonAdminRepository.deleteAndRecalculateDuration(id);
  },
};
