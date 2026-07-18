import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllCourseQuery } from "../course.types";

export const courseRepository = {
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
      ...(instructorId && {
        instructorId,
      }),
      ...(categoryId && {
        categoryId,
      }),
      ...(level && {
        level,
      }),
      ...(typeof isPublished === "boolean" && {
        isPublished,
      }),
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
              isVerified: true,
              status: true,
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

  async findByIdWithRelations(id: number) {
    return prisma.course.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        instructor: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                phone: true,
                avatar: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });
  },
};
