import createHttpError from "http-errors";
import {
  ChapterListQuery,
  ICreateChapterRequest,
  IUpdateChapterRequest,
} from "../chapter.types";
import { chapterAdminRepository } from "./chapter.admin.repository";

export const chapterAdminService = {
  async getAll(query: ChapterListQuery) {
    return chapterAdminRepository.getAll(query);
  },

  async getOne(id: number) {
    const chapter = await chapterAdminRepository.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    return chapter;
  },

  async create(data: ICreateChapterRequest) {
    const lastChapter = await chapterAdminRepository.findLastCourseChapter(
      data.courseId,
    );

    const nextOrder = lastChapter ? lastChapter.order + 1 : 1;

    return chapterAdminRepository.create({
      title: data.title.trim(),
      courseId: data.courseId,
      order: nextOrder,
    });
  },

  async edit(id: number, data: IUpdateChapterRequest) {
    const chapter = await chapterAdminRepository.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    return chapterAdminRepository.update(id, data);
  },

  async delete(id: number) {
    const chapter = await chapterAdminRepository.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    return chapterAdminRepository.deleteWithChildren(id);
  },
};
