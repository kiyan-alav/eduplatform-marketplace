import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllLessonsQuery } from "../lesson.types";

export const lessonRepository = {
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
};
