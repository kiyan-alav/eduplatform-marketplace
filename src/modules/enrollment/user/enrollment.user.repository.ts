import { prisma } from "../../../configs/prisma";
import { Prisma } from "../../../generated/prisma/client";
import {
  buildPagination,
  paginationMeta,
} from "../../../types/buildPagination";
import {
  GetAllEnrollmentsQuery,
  ICreateEnrollmentRequest,
} from "../enrollment.types";

export const enrollmentUserRepository = {
  async getAll(params: GetAllEnrollmentsQuery, studentId: number) {
    const { limit, page, courseId } = params;
    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.EnrollmentWhereInput = {
      studentId,
      ...(courseId && { courseId }),
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.enrollment.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: "desc" },
        include: {
          course: { select: { id: true, title: true, cover: true } },
        },
      }),
      prisma.enrollment.count({ where }),
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

  async findById(studentId: number, courseId: number) {
    return prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            cover: true,
          },
        },
      },
    });
  },

  async findStudentProfileByUserId(userId: number) {
    return prisma.studentProfile.findUnique({ where: { userId } });
  },

  async findCourseById(courseId: number) {
    return prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true },
    });
  },

  async create(data: ICreateEnrollmentRequest) {
    return prisma.enrollment.create({
      data: {
        studentId: data.studentId,
        courseId: data.courseId,
        paid: data.paid,
        paidAt: data.paidAt,
      },
      include: {
        course: { select: { id: true, title: true } },
      },
    });
  },
};
