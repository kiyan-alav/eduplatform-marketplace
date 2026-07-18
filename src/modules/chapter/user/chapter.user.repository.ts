import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import {
  GetAllChapterQuery,
  ICreateChapterRequest,
  IUpdateChapterRequest,
} from "../chapter.types";

export const userChapterRepository = {
  async getAll(params: GetAllChapterQuery, instructorCourseIds: number[]) {
    const { limit, page, title, courseId } = params;

    const { skip, take } = buildPagination({ limit, page });

    if (instructorCourseIds.length === 0) {
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

    const where: Prisma.ChapterWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      }),
      courseId: courseId
        ? {
            equals: courseId,
            in: instructorCourseIds,
          }
        : {
            in: instructorCourseIds,
          },
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
            instructorId: true,
          },
        },
      },
    });
  },

  async findByIdWithRelations(id: number) {
    return prisma.chapter.findUnique({
      where: { id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            instructorId: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },

  async create(data: ICreateChapterRequest) {
    const { title, courseId, order } = data;

    return prisma.chapter.create({
      data: {
        title,
        courseId,
        order,
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

  async delete(id: number) {
    return prisma.chapter.delete({
      where: { id },
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
};
