import { Response } from "express";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { EnrollmentListQuerySchema } from "../enrollment.filter";
import { enrollmentUserService } from "./enrollment.user.service";

export const enrollmentUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;
    const query = EnrollmentListQuerySchema.parse(req.query);
    const enrollmentData = await enrollmentUserService.getAll(+userId, query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: enrollmentData.items,
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
    const courseId = Number(req.params.courseId);
    const enrollment = await enrollmentUserService.getOne(+userId, courseId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: enrollment,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId as string;
    const enrollment = await enrollmentUserService.create(+userId, req.body);

    const response = buildApiResponse({
      success: true,
      message: "Enrollment created successfully",
      data: enrollment,
    });

    return res.status(201).json(response);
  }),
};
