import { prisma } from "../../../configs/prisma";
import { ICreateRatingRequest } from "../rating.types";

export const ratingUserRepository = {
  async create(data: ICreateRatingRequest) {
    return prisma.rating.create({
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
  },

  async findById(id: number) {
    return prisma.rating.findUnique({ where: { id } });
  },

  async findExistingRating(userId: number, courseId: number) {
    return prisma.rating.findFirst({
      where: { userId, courseId },
    });
  },

  async delete(id: number) {
    return prisma.rating.delete({ where: { id } });
  },
};
