import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { lessonService } from "./lesson.service";

export const lessonController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const lessonData = await lessonService.getAll(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: lessonData.docs,
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
    const id = req.params.id as string;
    const lesson = await lessonService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),
};
