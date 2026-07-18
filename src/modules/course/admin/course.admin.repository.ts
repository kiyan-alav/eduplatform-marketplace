import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import {
  GetAllCourseQuery,
  ICreateCourseRequest,
  IUpdateCourseRequest,
} from "../course.types";

export const adminCourseRepository = {
  async getAll(params: GetAllCourseQuery) {
    const { limit, page, title, instructorId, categoryId, level, isPublished } =
      params;

    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.CourseWhereInput = {
      ...(title && {
        title: {
          contains: title,
          mode: "insensitive",
        },
      }),
      ...(instructorId !== undefined && { instructorId }),
      ...(categoryId !== undefined && { categoryId }),
      ...(level !== undefined && { level }),
      ...(typeof isPublished === "boolean" && { isPublished }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.course.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          instructor: {
            select: {
              id: true,
              verification: true,
              user: {
                select: {
                  id: true,
                  fullName: true,
                  email: true,
                  phone: true,
                  avatar: true,
                },
              },
            },
          },
        },
      }),
      prisma.course.count({ where }),
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
    return prisma.course.findUnique({
      where: { id },
    });
  },

  async findByIdWithRelations(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        category: true,
        instructor: {
          include: {
            user: true,
          },
        },
      },
    });
  },

  async create(data: ICreateCourseRequest, cover?: string) {
    return prisma.course.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        instructorId: data.instructor,
        price: data.price,
        level: data.level,
        categoryId: data.category,
        cover: cover ?? null,
        isPublished: true,
      },
    });
  },

  async update(id: number, data: IUpdateCourseRequest, cover?: string) {
    return prisma.course.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && {
          description: data.description.trim(),
        }),
        ...(data.instructor !== undefined && {
          instructorId: data.instructor,
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.category !== undefined && { categoryId: data.category }),
        ...(cover !== undefined && { cover }),
      },
    });
  },

  async deleteWithRelations(id: number) {
    return prisma.$transaction(async (tx) => {
      const chapters = await tx.chapter.findMany({
        where: { courseId: id },
        select: { id: true },
      });

      const chapterIds = chapters.map((chapter) => chapter.id);

      if (chapterIds.length > 0) {
        await tx.lesson.deleteMany({
          where: {
            chapterId: {
              in: chapterIds,
            },
          },
        });
      }

      await tx.chapter.deleteMany({
        where: { courseId: id },
      });

      return tx.course.delete({
        where: { id },
      });
    });
  },

  async togglePublish(id: number) {
    const course = await prisma.course.findUnique({
      where: { id },
      select: {
        id: true,
        isPublished: true,
      },
    });

    if (!course) return null;

    return prisma.course.update({
      where: { id },
      data: {
        isPublished: !course.isPublished,
      },
    });
  },
};
