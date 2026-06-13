import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { enrollmentAdminService } from "./enrollment.admin.service";

export const enrollmentAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const enrollmentData = await enrollmentAdminService.getAll(req.query);

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

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const course = await enrollmentAdminService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
