import { prisma } from "../../../configs/prisma";
import { ICreateRatingRequest } from "../rating.types";

async function recalculateCourseRating(courseId: number) {
  const result = await prisma.rating.aggregate({
    where: { courseId, isApproved: true },
    _avg: { score: true },
    _count: { id: true },
  });

  const avgRating = result._avg.score
    ? Number(result._avg.score.toFixed(1))
    : 0;
  const ratingCount = result._count.id;

  await prisma.course.update({
    where: { id: courseId },
    data: { avgRating, ratingCount },
  });
}

export const ratingUserRepository = {
  async findExistingRating(userId: number, courseId: number) {
    return prisma.rating.findFirst({ where: { userId, courseId } });
  },

  async findById(id: number) {
    return prisma.rating.findUnique({ where: { id } });
  },

  async createAndRecalculate(data: ICreateRatingRequest) {
    return prisma.$transaction(async (tx) => {
      const rating = await tx.rating.create({
        data: {
          userId: data.userId,
          courseId: data.courseId,
          score: data.score,
          description: data.description,
        },
        include: {
          user: { select: { id: true, fullName: true, avatar: true } },
          course: { select: { id: true, title: true } },
        },
      });

      const aggResult = await tx.rating.aggregate({
        where: { courseId: data.courseId, isApproved: true },
        _avg: { score: true },
        _count: { id: true },
      });

      const avgRating = aggResult._avg.score
        ? Number(aggResult._avg.score.toFixed(1))
        : 0;

      await tx.course.update({
        where: { id: data.courseId },
        data: { avgRating, ratingCount: aggResult._count.id },
      });

      return rating;
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
};
