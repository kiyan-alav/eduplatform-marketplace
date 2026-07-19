import { RatingListQuery } from "../rating.types";
import { ratingRepository } from "./rating.repository";

export const ratingService = {
  async getAll(params: RatingListQuery) {
    return ratingRepository.getAll(params);
  },
};
