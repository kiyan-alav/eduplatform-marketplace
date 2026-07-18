import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllChapterQuery } from "../chapter.types";

export const chapterRepository = {
  async getAll(params: GetAllChapterQuery) {
    const { limit, page, title, courseId } = params;
    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.ChapterWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      }),
      ...(courseId && { courseId }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.chapter.findMany({
        where,
        skip,
        take,
        orderBy: [{ courseId: "asc" }, { order: "asc" }],
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.chapter.count({ where }),
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
    return prisma.chapter.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  },
};
