import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { EnrollmentListQuerySchema } from "../enrollment.filter";
import { enrollmentAdminService } from "./enrollment.admin.service";

export const enrollmentAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = EnrollmentListQuerySchema.parse(req.query);
    const enrollmentData = await enrollmentAdminService.getAll(query);

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

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const studentId = Number(req.params.studentId);
    const courseId = Number(req.params.courseId);
    const enrollment = await enrollmentAdminService.getOne(studentId, courseId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: enrollment,
    });

    return res.status(200).json(response);
  }),
};
