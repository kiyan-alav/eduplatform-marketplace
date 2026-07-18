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

export const lessonAdminRepository = {
  async getAll(params: GetAllLessonsQuery) {
    const { limit, page, title, chapterId, courseId } = params;
    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.LessonWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      }),
      ...(chapterId && { chapterId }),
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
        orderBy: { order: "asc" },
        include: {
          chapter: {
            select: {
              id: true,
              title: true,
              totalDuration: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      }),
      prisma.lesson.count({ where }),
    ]);

    const { totalPages, hasNextPage, hasPrevPage } = paginationMeta({
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
            totalDuration: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
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

  async create(data: ICreateLessonRequest, order: number) {
    return prisma.lesson.create({
      data: {
        title: data.title.trim(),
        chapterId: data.chapterId,
        duration: data.duration,
        order,
      },
      include: {
        chapter: {
          select: {
            id: true,
            title: true,
            totalDuration: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
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
            totalDuration: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
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
