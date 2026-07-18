import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import {
  GetAllLessonsQuery,
  ICreateLessonRequest,
  IUpdateLessonRequest,
} from "../lesson.types";

export const userLessonRepository = {
  async getAll(params: GetAllLessonsQuery, allowedChapterIds: number[]) {
    const { limit, page, title, chapterId, courseId } = params;
    const { skip, take } = buildPagination({ limit, page });

    if (allowedChapterIds.length === 0) {
      return {
        items: [],
        page,
        limit,
        totalDocs: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false,
      };
    }

    const where: Prisma.LessonWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      }),
      chapterId: chapterId
        ? {
            equals: chapterId,
            in: allowedChapterIds,
          }
        : {
            in: allowedChapterIds,
          },
      ...(courseId && {
        chapter: {
          courseId,
        },
      }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.lesson.findMany({
        where,
        skip,
        take,
        orderBy: [{ chapterId: "asc" }, { order: "asc" }],
        include: {
          chapter: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.lesson.count({ where }),
    ]);

    const { hasNextPage, hasPrevPage, totalPages } = paginationMeta({
      limit,
      page,
      totalDocs,
    });

    return {
      items,
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  },

  async findById(id: number) {
    return prisma.lesson.findUnique({
      where: { id },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            courseId: true,
          },
        },
      },
    });
  },

  async findChapterById(chapterId: number) {
    return prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        id: true,
        courseId: true,
      },
    });
  },

  async findLastLessonInChapter(chapterId: number) {
    return prisma.lesson.findFirst({
      where: { chapterId },
      orderBy: { order: "desc" },
      select: { order: true },
    });
  },

  async findInstructorProfileByUserId(userId: number) {
    return prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
  },

  async findInstructorCoursesByInstructorId(instructorId: number) {
    return prisma.course.findMany({
      where: { instructorId },
      select: { id: true },
    });
  },

  async findChaptersByCourseIds(courseIds: number[]) {
    return prisma.chapter.findMany({
      where: {
        courseId: {
          in: courseIds,
        },
      },
      select: { id: true },
    });
  },

  async create(data: ICreateLessonRequest) {
    const { title, chapterId, duration, order } = data;

    return prisma.lesson.create({
      data: {
        title,
        chapterId,
        duration,
        order,
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  async update(id: number, data: IUpdateLessonRequest) {
    return prisma.lesson.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.chapterId !== undefined && { chapterId: data.chapterId }),
        ...(data.duration !== undefined && { duration: data.duration }),
        ...(data.order !== undefined && { order: data.order }),
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },

  async delete(id: number) {
    return prisma.lesson.delete({
      where: { id },
    });
  },
};
