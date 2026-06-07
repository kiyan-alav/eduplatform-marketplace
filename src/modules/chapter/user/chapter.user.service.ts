import createHttpError from "http-errors";
import { startSession, Types } from "mongoose";
import { buildQueryFilters } from "../../../utils/query-builder";
import { Course } from "../../course/course.model";
import { InstructorProfile } from "../../user/profiles/instructor/instructor.model";
import { chapterFilterConfig } from "../chapter.filter";
import { Chapter } from "../chapter.model";
import {
  IChapterFilter,
  ICreateChapterRequest,
  IUpdateChapterRequest,
} from "../chapter.types";

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

const validateInstructorCourse = (
  courseId: Types.ObjectId,
  instructorCourseIds: string[],
) => {
  const hasCourse = instructorCourseIds.includes(courseId.toString());

  if (!hasCourse) {
    throw createHttpError(403, "You are not authorized to access this chapter");
  }
};

export const chapterUserService = {
  async getAll(filters: IChapterFilter, userId?: string) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      chapterFilterConfig,
    );

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    const requestedCourse =
      typeof mongoFilter.course === "string" ? mongoFilter.course : undefined;

    if (requestedCourse) {
      if (!instructorCourseIds.includes(requestedCourse)) {
        return Chapter.paginate({ _id: { $in: [] } }, options);
      }

      return Chapter.paginate(
        { ...mongoFilter, course: requestedCourse },
        options,
      );
    }

    if (instructorCourseIds.length === 0) {
      return Chapter.paginate({ _id: { $in: [] } }, options);
    }

    mongoFilter.course = { $in: instructorCourseIds };
    options.populate = [{ path: "course", select: "title" }];
    options.sort = { order: 1 };

    return Chapter.paginate(mongoFilter, options);
  },

  async getOne(id: string, userId?: string) {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    validateInstructorCourse(chapter.course, instructorCourseIds);

    return chapter.populate({ path: "course", select: "title" });
  },

  async create(data: ICreateChapterRequest, userId?: string) {
    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    if (!Types.ObjectId.isValid(data.course)) {
      throw createHttpError(400, "Invalid course id");
    }

    if (!instructorCourseIds.includes(data.course)) {
      throw createHttpError(
        403,
        "You are not authorized to assign chapter to this course",
      );
    }

    const session = await startSession();
    session.startTransaction();

    try {
      const lastChapter = await Chapter.findOne({ course: data.course })
        .sort({ order: -1 })
        .session(session);

      const nextOrder = lastChapter ? lastChapter.order + 1 : 1;

      const chapter = await Chapter.create(
        [
          {
            title: data.title.trim(),
            course: new Types.ObjectId(data.course),
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

  async edit(id: string, data: IUpdateChapterRequest, userId?: string) {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    validateInstructorCourse(chapter.course, instructorCourseIds);

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

      if (!instructorCourseIds.includes(data.course)) {
        throw createHttpError(
          403,
          "You are not authorized to move chapter to this course",
        );
      }

      chapter.course = new Types.ObjectId(data.course);
    }

    await chapter.save();

    return chapter;
  },

  async delete(id: string, userId?: string) {
    const chapter = await Chapter.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    const instructorId = await getInstructorProfile(userId || "");
    const instructorCourseIds = await getInstructorCourseIds(instructorId);

    validateInstructorCourse(chapter.course, instructorCourseIds);

    await chapter.deleteOne();

    return chapter;
  },
};
