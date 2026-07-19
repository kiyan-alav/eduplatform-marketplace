import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import { buildPagination, paginationMeta } from "../../../types/buildPagination";
import { GetAllEnrollmentsQuery } from "../enrollment.types";

export const enrollmentAdminRepository = {
  async getAll(params: GetAllEnrollmentsQuery) {
    const { limit, page, courseId, studentId } = params;
    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.EnrollmentWhereInput = {
      ...(courseId && { courseId }),
      ...(studentId && { studentId }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.enrollment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          course: { select: { id: true, title: true } },
          student: {
            include: {
              user: { select: { id: true, fullName: true, email: true, avatar: true } },
            },
          },
        },
      }),
      prisma.enrollment.count({ where }),
    ]);

    const { totalPages, hasNextPage, hasPrevPage } = paginationMeta({ limit, page, totalDocs });
    return { items, page, limit, totalDocs, totalPages, hasNextPage, hasPrevPage };
  },

  async findById(studentId: number, courseId: number) {
    return prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
      include: {
        course: { select: { id: true, title: true, description: true, price: true } },
        student: {
          include: {
            user: { select: { id: true, fullName: true, email: true, avatar: true } },
          },
        },
      },
    });
  },
};
