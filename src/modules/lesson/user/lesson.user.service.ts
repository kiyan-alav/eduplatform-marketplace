import createHttpError from "http-errors";
import { startSession, Types } from "mongoose";
import { buildQueryFilters } from "../../../utils/query-builder";
import { Chapter } from "../../chapter/chapter.model";
import { Course } from "../../course/course.model";
import { InstructorProfile } from "../../user/profiles/instructor/instructor.model";
import { lessonFilterConfig } from "../leeson.filter";
import { Lesson } from "../lesson.model";
import {
  ICreateLessonRequest,
  ILessonFilter,
  IUpdateLessonRequest,
} from "../lesson.types";

const getInstructorProfile = async (userId: string) => {
  const instructor = await InstructorProfile.findOne({ user: userId }).select(
    "_id",
  );

  if (!instructor) {
    throw createHttpError(
      403,
      "You are not authorized to manage chapters. You must be an instructor.",
    );
  }

  return instructor._id;
};

const getInstructorCourseIds = async (instructorId: Types.ObjectId) => {
  const courses = await Course.find({ instructor: instructorId })
    .select("_id")
    .lean();
  return courses.map((course) => course._id.toString());
};

const validateChapterOwnership = async (
  chapterId: string | Types.ObjectId,
  instructorCourseIds: string[],
) => {
  const chapter = await Chapter.findById(chapterId).select("course");
  if (!chapter) {
    throw createHttpError(404, "Chapter not found!");
  }
  if (!instructorCourseIds.includes(chapter.course.toString())) {
    throw createHttpError(403, "You are not authorized to access this chapter");
  }
  return chapter;
};

export const lessonUserService = {
  async getAll(filters: ILessonFilter, userId?: string) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      lessonFilterConfig,
    );

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    if (mongoFilter.chapter) {
      await validateChapterOwnership(mongoFilter.chapter, instructorCourseIds);
    } else {
      const allowedChapters = await Chapter.find({
        course: { $in: instructorCourseIds },
      }).select("_id");
      const allowedChapterIds = allowedChapters.map((c) => c._id);
      mongoFilter.chapter = { $in: allowedChapterIds };
    }

    options.populate = [{ path: "chapter", select: "title" }];
    options.sort = { order: 1 };

    return Lesson.paginate(mongoFilter, options);
  },

  async getOne(id: string, userId?: string) {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    await validateChapterOwnership(lesson.chapter, instructorCourseIds);

    return lesson.populate({ path: "course", select: "title" });
  },

  async create(data: ICreateLessonRequest, userId?: string) {
    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    if (!Types.ObjectId.isValid(data.chapter)) {
      throw createHttpError(400, "Invalid chapter id");
    }

    await validateChapterOwnership(data.chapter, instructorCourseIds);

    const session = await startSession();
    session.startTransaction();

    try {
      const lastLesson = await Lesson.findOne({ course: data.chapter })
        .sort({ order: -1 })
        .session(session);

      const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

      const lesson = new Lesson({
        title: data.title.trim(),
        chapter: new Types.ObjectId(data.chapter),
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

  async edit(id: string, data: IUpdateLessonRequest, userId?: string) {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    await validateChapterOwnership(lesson.chapter, instructorCourseIds);

    if (typeof data.title === "string") {
      lesson.title = data.title.trim();
    }

    if (typeof data.order === "number") {
      lesson.order = data.order;
    }

    if (typeof data.duration === "number") {
      lesson.duration = data.duration;
    }

    if (typeof data.chapter === "string") {
      if (!Types.ObjectId.isValid(data.chapter)) {
        throw createHttpError(400, "Invalid chapter id");
      }

      await validateChapterOwnership(data.chapter, instructorCourseIds);
      lesson.chapter = new Types.ObjectId(data.chapter);
    }

    await lesson.save();

    return lesson;
  },

  async delete(id: string, userId?: string) {
    const lesson = await Lesson.findById(id);

    if (!lesson) {
      throw createHttpError(404, "Lesson not found!");
    }

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    await validateChapterOwnership(lesson.chapter, instructorCourseIds);

    await lesson.deleteOne();

    return lesson;
  },
};
