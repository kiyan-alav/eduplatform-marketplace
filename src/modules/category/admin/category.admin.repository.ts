import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import { GetAllCategoryQuery, ICreateCategoryRequest } from "../category.types";

export const adminCategoryRepository = {
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

  async findByNameOrSlug(name: string, slug: string) {
    return prisma.category.findFirst({
      where: {
        OR: [
          {
            name: {
              contains: name,
            },
          },
          {
            slug: {
              equals: slug,
            },
          },
        ],
      },
    });
  },

  async create({ name, slug }: ICreateCategoryRequest) {
    return prisma.category.create({
      data: {
        name,
        slug,
      },
    });
  },

  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  },

  async findByNameOrSlugExceptId(id: number, name?: string, slug?: string) {
    const orConditions: Prisma.CategoryWhereInput[] = [];

    if (name) {
      orConditions.push({
        name: {
          equals: name,
          mode: "insensitive",
        },
      });
    }

    if (slug) {
      orConditions.push({
        slug: {
          equals: slug,
        },
      });
    }

    if (orConditions.length === 0) return null;

    return prisma.category.findFirst({
      where: {
        id: {
          not: id,
        },
        OR: orConditions,
      },
    });
  },

  async update(id: number, data: { name?: string; slug?: string }) {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  async delete(id: number) {
    return prisma.category.delete({
      where: {
        id,
      },
    });
  },
};
