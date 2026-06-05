import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { courseAdminService } from "../admin/course.admin.service";

export const courseController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const courseData = await courseAdminService.getAll(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: courseData.docs,
      meta: {
        limit: courseData.limit,
        page: courseData.page as number,
        total: courseData.totalDocs,
        totalPages: courseData.totalPages,
        hasNextPage: courseData.hasNextPage,
        hasPrevPage: courseData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const course = await courseAdminService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
