import createHttpError from "http-errors";
import { ICreateLessonRequest, IUpdateLessonRequest, LessonListQuery } from "../lesson.types";
import { userLessonRepository } from "./lesson.user.repository";

const getInstructorCourseIds = async (userId: number): Promise<number[]> => {
  const instructor = await userLessonRepository.findInstructorProfileByUserId(userId);
  if (!instructor) {
    throw createHttpError(403, "You are not authorized to manage lessons. You must be an instructor.");
  }
  const courses = await userLessonRepository.findInstructorCoursesByInstructorId(instructor.id);
  return courses.map((course) => course.id);
};

const validateChapterOwnership = async (chapterId: number, instructorCourseIds: number[]) => {
  const chapter = await userLessonRepository.findChapterById(chapterId);
  if (!chapter) throw createHttpError(404, "Chapter not found!");
  if (!instructorCourseIds.includes(chapter.courseId)) {
    throw createHttpError(403, "You are not authorized to access this chapter");
  }
  return chapter;
};

export const lessonUserService = {
  async getAll(query: LessonListQuery, userId: number) {
    const instructorCourseIds = await getInstructorCourseIds(userId);

    let allowedChapterIds: number[] = [];
    if (query.chapterId) {
      await validateChapterOwnership(query.chapterId, instructorCourseIds);
      allowedChapterIds = [query.chapterId];
    } else {
      if (instructorCourseIds.length > 0) {
        const chapters = await userLessonRepository.findChaptersByCourseIds(instructorCourseIds);
        allowedChapterIds = chapters.map((c) => c.id);
      }
    }

    return userLessonRepository.getAll(query, allowedChapterIds);
  },

  async getOne(id: number, userId: number) {
    const lesson = await userLessonRepository.findById(id);
    if (!lesson) throw createHttpError(404, "Lesson not found!");

    const instructorCourseIds = await getInstructorCourseIds(userId);
    await validateChapterOwnership(lesson.chapterId, instructorCourseIds);
    return lesson;
  },

  async create(data: ICreateLessonRequest, userId: number) {
    const instructorCourseIds = await getInstructorCourseIds(userId);
    await validateChapterOwnership(data.chapterId, instructorCourseIds);

    const lastLesson = await userLessonRepository.findLastLessonInChapter(data.chapterId);
    const nextOrder = lastLesson ? lastLesson.order + 1 : 1;

    return userLessonRepository.createAndRecalculateDuration({
      title: data.title.trim(),
      chapterId: data.chapterId,
      duration: data.duration,
      order: nextOrder,
    });
  },

  async edit(id: number, data: IUpdateLessonRequest, userId: number) {
    const lesson = await userLessonRepository.findById(id);
    if (!lesson) throw createHttpError(404, "Lesson not found!");

    const instructorCourseIds = await getInstructorCourseIds(userId);
    await validateChapterOwnership(lesson.chapterId, instructorCourseIds);

    if (data.chapterId !== undefined) {
      await validateChapterOwnership(data.chapterId, instructorCourseIds);
    }

    return userLessonRepository.updateAndRecalculateDuration(id, data);
  },

  async delete(id: number, userId: number) {
    const lesson = await userLessonRepository.findById(id);
    if (!lesson) throw createHttpError(404, "Lesson not found!");

    const instructorCourseIds = await getInstructorCourseIds(userId);
    await validateChapterOwnership(lesson.chapterId, instructorCourseIds);

    return userLessonRepository.deleteAndRecalculateDuration(id);
  },
};
