import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { RatingListQuerySchema } from "../rating.filter";
import { ratingService } from "./rating.service";

export const ratingController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = RatingListQuerySchema.parse(req.query);
    const ratingData = await ratingService.getAll(query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: ratingData.items,
      meta: {
        limit: ratingData.limit,
        page: ratingData.page as number,
        total: ratingData.totalDocs,
        totalPages: ratingData.totalPages,
        hasNextPage: ratingData.hasNextPage,
        hasPrevPage: ratingData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),
};
