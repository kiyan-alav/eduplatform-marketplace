import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { buildPagination, paginationMeta } from "../../../types/buildPagination";
import { GetAllLessonsQuery, ICreateLessonRequest, IUpdateLessonRequest } from "../lesson.types";

export const userLessonRepository = {
  async getAll(params: GetAllLessonsQuery, allowedChapterIds: number[]) {
    const { limit, page, title, chapterId, courseId } = params;
    const { skip, take } = buildPagination({ limit, page });

    if (allowedChapterIds.length === 0) {
      return { items: [], page, limit, totalDocs: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false };
    }

    const where: Prisma.LessonWhereInput = {
      ...(title && { title: { contains: title, mode: "insensitive" } }),
      chapterId: chapterId
        ? { equals: chapterId, in: allowedChapterIds }
        : { in: allowedChapterIds },
      ...(courseId && { chapter: { courseId } }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.lesson.findMany({
        where, skip, take,
        orderBy: [{ chapterId: "asc" }, { order: "asc" }],
        include: { chapter: { select: { id: true, title: true } } },
      }),
      prisma.lesson.count({ where }),
    ]);

    const { hasNextPage, hasPrevPage, totalPages } = paginationMeta({ limit, page, totalDocs });
    return { items, page, limit, totalDocs, totalPages, hasNextPage, hasPrevPage };
  },

  async findById(id: number) {
    return prisma.lesson.findUnique({
      where: { id },
      include: { chapter: { select: { id: true, title: true, courseId: true } } },
    });
  },

  async findChapterById(chapterId: number) {
    return prisma.chapter.findUnique({ where: { id: chapterId }, select: { id: true, courseId: true } });
  },

  async findLastLessonInChapter(chapterId: number) {
    return prisma.lesson.findFirst({ where: { chapterId }, orderBy: { order: "desc" }, select: { order: true } });
  },

  async findInstructorProfileByUserId(userId: number) {
    return prisma.instructorProfile.findFirst({ where: { userId }, select: { id: true } });
  },

  async findInstructorCoursesByInstructorId(instructorId: number) {
    return prisma.course.findMany({ where: { instructorId }, select: { id: true } });
  },

  async findChaptersByCourseIds(courseIds: number[]) {
    return prisma.chapter.findMany({ where: { courseId: { in: courseIds } }, select: { id: true } });
  },

  async createAndRecalculateDuration(data: ICreateLessonRequest) {
    return prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.create({
        data: { title: data.title.trim(), chapterId: data.chapterId, duration: data.duration, order: data.order },
        include: { chapter: { select: { id: true, title: true } } },
      });

      const aggResult = await tx.lesson.aggregate({
        where: { chapterId: data.chapterId },
        _sum: { duration: true },
      });

      await tx.chapter.update({
        where: { id: data.chapterId },
        data: { totalDuration: aggResult._sum.duration ?? 0 },
      });

      return lesson;
    });
  },

  async updateAndRecalculateDuration(id: number, data: IUpdateLessonRequest) {
    return prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.update({
        where: { id },
        data: {
          ...(data.title !== undefined && { title: data.title.trim() }),
          ...(data.chapterId !== undefined && { chapterId: data.chapterId }),
          ...(data.duration !== undefined && { duration: data.duration }),
          ...(data.order !== undefined && { order: data.order }),
        },
        include: { chapter: { select: { id: true, title: true } } },
      });

      const chaptersToUpdate = new Set<number>([lesson.chapterId]);
      if (data.chapterId !== undefined && data.chapterId !== lesson.chapterId) {
        chaptersToUpdate.add(data.chapterId);
      }

      for (const chId of chaptersToUpdate) {
        const aggResult = await tx.lesson.aggregate({
          where: { chapterId: chId },
          _sum: { duration: true },
        });
        await tx.chapter.update({
          where: { id: chId },
          data: { totalDuration: aggResult._sum.duration ?? 0 },
        });
      }

      return lesson;
    });
  },

  async deleteAndRecalculateDuration(id: number) {
    return prisma.$transaction(async (tx) => {
      const lesson = await tx.lesson.delete({ where: { id } });

      const aggResult = await tx.lesson.aggregate({
        where: { chapterId: lesson.chapterId },
        _sum: { duration: true },
      });

      await tx.chapter.update({
        where: { id: lesson.chapterId },
        data: { totalDuration: aggResult._sum.duration ?? 0 },
      });

      return lesson;
    });
  },
};
