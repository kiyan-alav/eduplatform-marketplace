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

  async delete(id: number) {
    return prisma.rating.delete({ where: { id } });
  },

  async toggleVisibility(id: number) {
    const rating = await prisma.rating.findUnique({ where: { id } });
    if (!rating) return null;
    return prisma.rating.update({
      where: { id },
      data: { isApproved: !rating.isApproved },
    });
  },
};
