import createHttpError from "http-errors";
import { ICreateRatingRequest } from "../rating.types";
import { ratingUserRepository } from "./rating.user.repository";

export const userRatingService = {
  async createRating(data: ICreateRatingRequest) {
    const existing = await ratingUserRepository.findExistingRating(
      data.userId,
      data.courseId,
    );
    
    if (existing) {
      throw createHttpError(409, "You have already rated this course!");
    }

    return ratingUserRepository.createAndRecalculate(data);
  },

  async deleteRating(id: number, userId: number) {
    const rating = await ratingUserRepository.findById(id);
    if (!rating) throw createHttpError(404, "Rating not found!");
    if (rating.userId !== userId) {
      throw createHttpError(403, "You can only delete your own ratings!");
    }
    return ratingUserRepository.deleteAndRecalculate(id);
  },
};
