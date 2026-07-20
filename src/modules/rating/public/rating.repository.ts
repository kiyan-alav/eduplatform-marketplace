import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllRatingsQuery } from "../rating.types";

export const ratingRepository = {
  async getAll(params: GetAllRatingsQuery) {
    const { limit, page, courseId } = params;
    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.RatingWhereInput = {
      isApproved: true,
      ...(courseId && { courseId }),
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
};
