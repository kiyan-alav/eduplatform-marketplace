import { Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { userRatingService } from "./rating.user.service";

export const userRatingController = {
  createRating: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;
    const { courseId, score, description } = req.body;

    const rating = await userRatingService.createRating({
      userId: +userId,
      courseId,
      score,
      description,
    });

    const response = buildApiResponse({
      message: "Rating created successfully",
      success: true,
      data: rating,
    });

    res.status(201).json(response);
  }),

  deleteRating: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;
    const { id } = paramsSchema.parse(req.params);
    await userRatingService.deleteRating(id, +userId);

    const response = buildApiResponse({
      message: "Rating deleted successfully",
      success: true,
      data: null,
    });
    res.status(200).json(response);
  }),
};
