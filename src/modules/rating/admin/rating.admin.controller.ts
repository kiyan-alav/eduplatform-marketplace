import { Request, Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { RatingListQuerySchema } from "../rating.filter";
import { adminRatingService } from "./rating.admin.service";

export const ratingAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = RatingListQuerySchema.parse(req.query);
    const ratingData = await adminRatingService.getAll(query);

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

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    await adminRatingService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Rating deleted successfully!",
    });

    return res.status(200).json(response);
  }),

  toggleVisibility: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    await adminRatingService.toggleVisibility(id);

    const response = buildApiResponse({
      success: true,
      message: "Rating visibility toggled successfully!",
    });

    return res.status(200).json(response);
  }),
};
