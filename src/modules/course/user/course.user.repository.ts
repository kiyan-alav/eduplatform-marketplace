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

export const userCourseRepository = {
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

  async findById(id: number) {
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

  async findByInstructorId(instructorId: number) {
    return prisma.course.findMany({
      where: { instructorId },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async create(data: ICreateCourseRequest & { cover?: string | null }) {
    const {
      title,
      description,
      instructorId,
      price,
      level,
      categoryId,
      cover,
    } = data;

    return prisma.course.create({
      data: {
        title,
        description,
        instructor: {
          connect: {
            id: instructorId,
          },
        },
        price,
        level,
        category: {
          connect: {
            id: categoryId,
          },
        },
        cover: cover ?? null,
      },
    });
  },

  async update(id: number, data: IUpdateCourseRequest & { cover?: string }) {
    return prisma.course.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title.trim() }),
        ...(data.description !== undefined && {
          description: data.description.trim(),
        }),
        ...(data.instructorId !== undefined && {
          instructor: {
            connect: {
              id: +data.instructorId,
            },
          },
        }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.level !== undefined && { level: data.level }),
        ...(data.categoryId !== undefined && { category: {
          connect: {
            id: +data.categoryId
          }
        } }),
        ...(data.cover !== undefined && { cover: data.cover }),
      },
    });
  },

  async delete(id: number) {
    return prisma.course.delete({
      where: { id },
    });
  },

  async deleteWithChildren(id: number) {
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

  async findInstructorProfileByUserId(userId: number) {
    return prisma.instructorProfile.findFirst({
      where: { userId },
      select: { id: true },
    });
  },
};
