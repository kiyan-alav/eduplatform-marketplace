import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { adminRatingService } from "./rating.admin.service";

export const ratingAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const ratingData = await adminRatingService.getAll(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: ratingData.docs,
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
    const ratingId = req.params.id as string;
    await adminRatingService.delete(ratingId);

    const response = buildApiResponse({
      success: true,
      message: "Rating deleted successfully!",
    });

    return res.status(200).json(response);
  }),

  toggleVisibility: asyncHandler(async (req: Request, res: Response) => {
    const ratingId = req.params.id as string;
    await adminRatingService.toggleVisibility(ratingId);

    const response = buildApiResponse({
      success: true,
      message: "Rating visibility toggled successfully!",
    });

    return res.status(200).json(response);
  }),
};
