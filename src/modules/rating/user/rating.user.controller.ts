import { Request, Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { userRatingService } from "./rating.user.service";

export const userRatingController = {
  createRating: asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.user!;
    const { course, score, description } = req.body;

    const rating = await userRatingService.createRating({
      user: userId,
      course,
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

  deleteRating: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;

    await userRatingService.deleteRating(id);

    const response = buildApiResponse({
      message: "Rating deleted successfully",
      success: true,
      data: null,
    });
    res.status(200).json(response);
  }),
};
