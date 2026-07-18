import { Request, Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { LessonListQuerySchema } from "../lesson.filter";
import { lessonService } from "./lesson.service";

export const lessonController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = LessonListQuerySchema.parse(req.query);
    const lessonData = await lessonService.getAll(query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: lessonData.items,
      meta: {
        limit: lessonData.limit,
        page: lessonData.page as number,
        total: lessonData.totalDocs,
        totalPages: lessonData.totalPages,
        hasNextPage: lessonData.hasNextPage,
        hasPrevPage: lessonData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const lesson = await lessonService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),
};
