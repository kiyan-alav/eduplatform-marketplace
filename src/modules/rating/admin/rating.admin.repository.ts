import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllRatingsQuery } from "../rating.types";

export const ratingAdminRepository = {
  async getAll(params: GetAllRatingsQuery) {
    const { limit, page, courseId, isApproved } = params;
    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.RatingWhereInput = {
      ...(courseId && { courseId }),
      ...(isApproved !== undefined && { isApproved }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.rating.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, fullName: true, avatar: true } },
          course: { select: { id: true, title: true } },
        },
      }),
      prisma.rating.count({ where }),
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
    return prisma.rating.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, avatar: true } },
        course: { select: { id: true, title: true } },
      },
    });
  },

  async deleteAndRecalculate(id: number) {
    return prisma.$transaction(async (tx) => {
      const rating = await tx.rating.delete({ where: { id } });

      const aggResult = await tx.rating.aggregate({
        where: { courseId: rating.courseId, isApproved: true },
        _avg: { score: true },
        _count: { id: true },
      });

      const avgRating = aggResult._avg.score
        ? Number(aggResult._avg.score.toFixed(1))
        : 0;

      await tx.course.update({
        where: { id: rating.courseId },
        data: { avgRating, ratingCount: aggResult._count.id },
      });

      return rating;
    });
  },

  async toggleVisibilityAndRecalculate(id: number) {
    return prisma.$transaction(async (tx) => {
      const rating = await tx.rating.findUnique({ where: { id } });
      if (!rating) return null;

      const updated = await tx.rating.update({
        where: { id },
        data: { isApproved: !rating.isApproved },
      });

      const aggResult = await tx.rating.aggregate({
        where: { courseId: rating.courseId, isApproved: true },
        _avg: { score: true },
        _count: { id: true },
      });

      const avgRating = aggResult._avg.score
        ? Number(aggResult._avg.score.toFixed(1))
        : 0;

      await tx.course.update({
        where: { id: rating.courseId },
        data: { avgRating, ratingCount: aggResult._count.id },
      });

      return updated;
    });
  },
};
