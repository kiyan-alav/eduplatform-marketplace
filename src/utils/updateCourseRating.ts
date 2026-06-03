import { Types } from "mongoose";
import { Course } from "../modules/course/course.model";
import { Rating } from "../modules/rating/rating.model";

export async function updateCourseRating(courseId: Types.ObjectId) {
  const result = await Rating.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$score" },
        ratingCount: { $sum: 1 },
      },
    },
  ]);

  if (result.length === 0) {
    await Course.findByIdAndUpdate(courseId, {
      $set: {
        averageRating: 0,
        ratingCount: 0,
      },
    });
    return;
  }

  await Course.findByIdAndUpdate(courseId, {
    $set: {
      averageRating: Number(result[0].averageRating.toFixed(1)),
      ratingCount: result[0].ratingCount,
    },
  });
}
