import createHttpError from "http-errors";
import { Rating } from "../rating.model";
import { ICreateRatingRequest } from "../rating.types";

export const userRatingService = {
  async createRating(data: ICreateRatingRequest) {
    const rating = new Rating(data);
    await rating.save();

    return rating;
  },

  async deleteRating(id: string) {
    const rating = await Rating.findOneAndDelete({ _id: id });
    if (!rating) {
      throw createHttpError(404, "Rating not found!");
    }
  },
};
