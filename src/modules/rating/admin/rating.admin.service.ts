import createHttpError from "http-errors";
import { updateCourseRating } from "../../../utils/updateCourseRating";
import { GetAllRatingsQuery } from "../rating.types";
import { ratingAdminRepository } from "./rating.admin.repository";

export const adminRatingService = {
  async getAll(filters: GetAllRatingsQuery) {
    return ratingAdminRepository.getAll(filters);
  },

  async delete(ratingId: number) {
    const rating = await ratingAdminRepository.findById(ratingId);
    if (!rating) throw createHttpError(404, "Rating not found!");
    await ratingAdminRepository.delete(ratingId);
    await updateCourseRating(rating.courseId);
  },

  async toggleVisibility(ratingId: number) {
    const rating = await ratingAdminRepository.toggleVisibility(ratingId);
    if (!rating) throw createHttpError(404, "Rating not found!");
    await updateCourseRating(rating.courseId);
  },
};
