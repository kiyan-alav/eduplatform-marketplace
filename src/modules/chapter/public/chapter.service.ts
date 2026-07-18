import createHttpError from "http-errors";
import { ChapterListQuery } from "../chapter.types";
import { chapterRepository } from "./chapter.repository";

export const chapterService = {
  async getAll(query: ChapterListQuery) {
    return chapterRepository.getAll(query);
  },

  async getOne(id: number) {
    const chapter = await chapterRepository.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    return chapter;
  },
};
