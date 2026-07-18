import { Request, Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CourseListQuerySchema } from "../course.filter";
import { courseService } from "./course.service";

export const courseController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = CourseListQuerySchema.parse(req.query);
    const courseData = await courseService.getAll(query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: courseData.items,
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
    const { id } = paramsSchema.parse(req.params);
    const course = await courseService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
