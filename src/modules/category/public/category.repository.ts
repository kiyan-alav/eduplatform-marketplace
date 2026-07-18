import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllCategoryQuery } from "../category.types";

export const categoryRepository = {
  async getAll(params: GetAllCategoryQuery) {
    const { limit, page, name } = params;

    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.CategoryWhereInput = {
      ...(name && {
        name: {
          contains: name,
        },
      }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.category.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.category.count({ where }),
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
};
