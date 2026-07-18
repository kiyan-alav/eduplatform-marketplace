import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllChapterQuery, ICreateChapterRequest, IUpdateChapterRequest } from "../chapter.types";

export const chapterAdminRepository = {
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

  async findLastCourseChapter(courseId: number) {
    return prisma.chapter.findFirst({
      where: { courseId },
      orderBy: {
        order: "desc",
      },
      select: {
        order: true,
      },
    });
  },

  async create(data: ICreateChapterRequest) {
    return prisma.chapter.create({
      data: {
        title: data.title,
        courseId: data.courseId,
        order: data.order,
      },
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

  async update(id: number, data: IUpdateChapterRequest) {
    return prisma.chapter.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.courseId !== undefined && { courseId: data.courseId }),
        ...(data.order !== undefined && { order: data.order }),
      },
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

  async deleteWithChildren(id: number) {
    return prisma.$transaction(async (tx) => {
      await tx.lesson.deleteMany({
        where: { chapterId: id },
      });

      return tx.chapter.delete({
        where: { id },
      });
    });
  },
};
