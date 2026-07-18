import { Request, Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ChapterListQuerySchema } from "../chapter.filter";
import { chapterService } from "./chapter.service";

export const chapterController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = ChapterListQuerySchema.parse(req.query);
    const chapterData = await chapterService.getAll(query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapterData.items,
      meta: {
        limit: chapterData.limit,
        page: chapterData.page as number,
        total: chapterData.totalDocs,
        totalPages: chapterData.totalPages,
        hasNextPage: chapterData.hasNextPage,
        hasPrevPage: chapterData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const chapter = await chapterService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),
};
