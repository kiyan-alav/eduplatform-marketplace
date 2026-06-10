import createHttpError from "http-errors";
import { startSession, Types } from "mongoose";
import { buildQueryFilters } from "../../../utils/query-builder";
import { lessonFilterConfig } from "../leeson.filter";
import { Lesson } from "../lesson.model";
import {
  ICreateLessonRequest,
  ILessonFilter,
  IUpdateLessonRequest,
} from "../lesson.types";

export const lessonAdminService = {
  async getAll(filters: ILessonFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      lessonFilterConfig,
    );
    options.populate = [
      {
        path: "chapter",
        select: "title totalDuration",
        populate: { path: "course", select: "_id title" },
      },
    ];
    options.sort = { order: 1 };

    return Lesson.paginate(mongoFilter, options);
  },

  async getOne(id: string) {
    const lesson = await Lesson.findById(id).populate({
      path: "chapter",
      select: "title totalDuration",
      populate: {
        path: "course",
        select: "_id title",
      },
    });

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    return lesson;
  },

  async create(data: ICreateLessonRequest) {
    const title = data.title.trim();

    if (!Types.ObjectId.isValid(data.chapter)) {
      throw createHttpError(400, "Invalid chapter id");
    }

    const chapterId = new Types.ObjectId(data.chapter);

    const session = await startSession();
    session.startTransaction();

    try {
      const lastLesson = await Lesson.findOne({ chapter: chapterId })
        .sort({ order: -1 })
        .session(session);

      const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

      const lesson = new Lesson({
        title,
        chapter: chapterId,
        order: nextOrder,
        duration: data.duration,
        // videoPath: data.videoPath || null,
      });

      await lesson.save({ session });

      await session.commitTransaction();
      session.endSession();

      return lesson;
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  },

  async edit(id: string, data: IUpdateLessonRequest) {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    if (typeof data.title === "string") {
      lesson.title = data.title.trim();
    }

    if (typeof data.order === "number") {
      lesson.order = data.order;
    }

    if (typeof data.chapter === "string") {
      if (!Types.ObjectId.isValid(data.chapter)) {
        throw createHttpError(400, "Invalid chapter id");
      }

      lesson.chapter = new Types.ObjectId(data.chapter);
    }

    await lesson.save();

    return lesson;
  },

  async delete(id: string) {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    await Lesson.deleteMany({ chapter: lesson._id });
    await lesson.deleteOne();

    return lesson;
  },
};
