import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { enrollmentUserService } from "./enrollment.user.service";

export const enrollmentUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;

    const enrollmentData = await enrollmentUserService.getAll(
      userId,
      req.query,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: enrollmentData.docs,
      meta: {
        limit: enrollmentData.limit,
        page: enrollmentData.page as number,
        total: enrollmentData.totalDocs,
        totalPages: enrollmentData.totalPages,
        hasNextPage: enrollmentData.hasNextPage,
        hasPrevPage: enrollmentData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  getOne: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;
    const id = req.params.id as string;
    const enrollment = await enrollmentUserService.getOne(userId, id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: enrollment,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;

    const bodyData = {
      ...req.body,
      student: userId,
    };

    const enrollment = await enrollmentUserService.create(userId, bodyData);

    const response = buildApiResponse({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment,
    });

    return res.status(201).json(response);
  }),
};
