import createHttpError from "http-errors";
import { startSession, Types } from "mongoose";
import { buildQueryFilters } from "../../../utils/query-builder";
import { Lesson } from "../../lesson/lesson.model";
import { chapterFilterConfig } from "../chapter.filter";
import { Chapter } from "../chapter.model";
import {
  IChapterFilter,
  ICreateChapterRequest,
  IUpdateChapterRequest,
} from "../chapter.types";

export const chapterAdminService = {
  async getAll(filters: IChapterFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      chapterFilterConfig,
    );
    options.populate = [{ path: "course", select: "title" }];
    options.sort = { order: 1 };

    return Chapter.paginate(mongoFilter, options);
  },

  async getOne(id: string) {
    const chapter = await Chapter.findById(id).populate({
      path: "course",
      select: "title",
    });

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    return chapter;
  },

  async create(data: ICreateChapterRequest) {
    const title = data.title.trim();

    if (!Types.ObjectId.isValid(data.course)) {
      throw createHttpError(400, "Invalid course id");
    }

    const courseId = new Types.ObjectId(data.course);

    const session = await startSession();
    session.startTransaction();

    try {
      const lastChapter = await Chapter.findOne({ course: courseId })
        .sort({ order: -1 })
        .session(session);

      const nextOrder = lastChapter ? lastChapter.order + 1 : 1;

      const chapter = await Chapter.create(
        [
          {
            title,
            course: courseId,
            order: nextOrder,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      session.endSession();

      return chapter[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  async edit(id: string, data: IUpdateChapterRequest) {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    if (typeof data.title === "string") {
      chapter.title = data.title.trim();
    }

    if (typeof data.order === "number") {
      chapter.order = data.order;
    }

    if (typeof data.course === "string") {
      if (!Types.ObjectId.isValid(data.course)) {
        throw createHttpError(400, "Invalid course id");
      }

      chapter.course = new Types.ObjectId(data.course);
    }

    await chapter.save();

    return chapter;
  },

  async delete(id: string) {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    await Lesson.deleteMany({ chapter: chapter._id });
    await chapter.deleteOne();

    return chapter;
  },
};
