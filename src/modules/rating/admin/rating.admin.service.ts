import createHttpError from "http-errors";
import { buildQueryFilters } from "../../../utils/query-builder";
import { ratingFilterConfig } from "../rating.filter";
import { Rating } from "../rating.model";
import { IRatingFilter } from "../rating.types";

export const adminRatingService = {
  async getAll(filters: IRatingFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      ratingFilterConfig,
    );

    const results = await Rating.paginate(mongoFilter, options);
    return results;
  },

  async delete(ratingId: string) {
    const rating = await Rating.findOneAndDelete({ _id: ratingId });
    if (!rating) {
      throw createHttpError(404, "Rating not found!");
    }
  },

  async toggleVisibility(ratingId: string) {
    const rating = await Rating.findById(ratingId);
    if (!rating) {
      throw createHttpError(404, "Rating not found!");
    }
    rating.isApproved = !rating.isApproved;
    await rating.save();
  },
};
