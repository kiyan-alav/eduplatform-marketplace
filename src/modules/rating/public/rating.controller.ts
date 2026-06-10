import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ratingService } from "./rating.service";

export const ratingController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const courseId = req.params.courseId as string;
    const ratingData = await ratingService.getAll(courseId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: ratingData,
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
