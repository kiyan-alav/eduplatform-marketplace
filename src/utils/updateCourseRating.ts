import { prisma } from "../configs/prisma";

export async function updateCourseRating(courseId: number) {
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
