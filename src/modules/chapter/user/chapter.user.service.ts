import createHttpError from "http-errors";
import { logger } from "../../../configs/logger";
import {
  ChapterListQuery,
  ICreateChapterRequest,
  IUpdateChapterRequest,
} from "../chapter.types";
import { userChapterRepository } from "./chapter.user.repository";

const getInstructorCourseIds = async (userId: number) => {
  const instructor =
    await userChapterRepository.findInstructorProfileByUserId(userId);

  if (!instructor) {
    throw createHttpError(
      403,
      "You are not authorized to manage chapters. You must be an instructor.",
    );
  }

  logger.info(instructor);

  const courses =
    await userChapterRepository.findInstructorCoursesByInstructorId(
      instructor.id,
    );

  return courses.map((course) => course.id);
};

const validateInstructorCourse = (
  courseId: number,
  instructorCourseIds: number[],
) => {
  if (!instructorCourseIds.includes(courseId)) {
    throw createHttpError(
      403,
      "You are not authorized to access this chapter!",
    );
  }
};

export const chapterUserService = {
  async getAll(query: ChapterListQuery, userId: number) {
    const instructorCourseIds = await getInstructorCourseIds(userId);

    if (query.courseId && !instructorCourseIds.includes(query.courseId)) {
      return {
        items: [],
        page: query.page,
        limit: query.limit,
        totalDocs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    return userChapterRepository.getAll(query, instructorCourseIds);
  },

  async getOne(id: number, userId: number) {
    const chapter = await userChapterRepository.findByIdWithRelations(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    const instructorCourseIds = await getInstructorCourseIds(userId);

    validateInstructorCourse(chapter.courseId, instructorCourseIds);

    return chapter;
  },

  async create(data: ICreateChapterRequest, userId: number) {
    const instructorCourseIds = await getInstructorCourseIds(userId);

    validateInstructorCourse(data.courseId, instructorCourseIds);

    return userChapterRepository.create({
      title: data.title.trim(),
      courseId: data.courseId,
      order: data.order,
    });
  },

  async edit(id: number, data: IUpdateChapterRequest, userId: number) {
    const chapter = await userChapterRepository.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    const instructorCourseIds = await getInstructorCourseIds(userId);

    validateInstructorCourse(chapter.courseId, instructorCourseIds);

    if (data.courseId !== undefined) {
      validateInstructorCourse(data.courseId, instructorCourseIds);
    }

    return userChapterRepository.update(id, data);
  },

  async delete(id: number, userId: number) {
    const chapter = await userChapterRepository.findById(id);

    if (!chapter) {
      throw createHttpError(404, "Chapter not found!");
    }

    const instructorCourseIds = await getInstructorCourseIds(userId);

    validateInstructorCourse(chapter.courseId, instructorCourseIds);

    return userChapterRepository.delete(id);
  },
};
