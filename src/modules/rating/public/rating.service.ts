import { Rating } from "../rating.model";

export const ratingService = {
  async getAll(courseId: string) {
    const ratings = await Rating.paginate({
      $and: [{ course: courseId }, { isApproved: true }],
    });
    return ratings;
  },
};
