import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import {
  GetAllInstructorRequestQuery,
  GetAllUserQuery,
  UpdateInstructorRequestStatus,
} from "../user.types";

export const adminUserRepository = {
  async getAll(params: GetAllUserQuery) {
    const { page, limit, email, phone, role } = params;

    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.UserWhereInput = {
      ...(email && {
        email: {
          contains: email,
          mode: "insensitive",
        },
      }),
      ...(phone && {
        phone: {
          contains: phone,
        },
      }),
      ...(role && {
        role: {
          contains: role,
        },
      }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
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

  async getById(id: number) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async getWithProfiles(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        adminProfile: true,
        instructorProfile: true,
        studentProfile: true,
      },
    });
  },

  async getAllInstructorRequest(params: GetAllInstructorRequestQuery) {
    const { limit, page, email, phone } = params;

    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.UserWhereInput = {
      ...(email && {
        email: {
          contains: email,
          mode: "insensitive",
        },
      }),
      ...(phone && {
        phone: {
          contains: phone,
        },
      }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.user.count({ where }),
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

  async getUserWithInstructorProfile(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        instructorProfile: true,
      },
    });
  },

  async updateInstructorRequestStatus({
    userId,
    isVerified,
    roles,
    status,
  }: UpdateInstructorRequestStatus) {
    return prisma.$transaction(async (tx) => {
      const instructorProfile = await tx.instructorProfile.update({
        where: { userId },
        data: {
          isVerified,
          status,
        },
      });

      const user = await tx.user.update({
        where: { id: userId },
        data: {
          roles,
        },
        include: {
          instructorProfile: true,
        },
      });

      return {
        user,
        instructorProfile,
      };
    });
  },
};
