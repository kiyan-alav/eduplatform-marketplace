import { Request } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { chapterService } from "./chapter.service";

export const chapterController = {
  getAll: asyncHandler(async (req: Request, res) => {
    const chapterData = await chapterService.getAll(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapterData.docs,
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

  getOne: asyncHandler(async (req: Request, res) => {
    const id = req.params.id as string;
    const chapter = await chapterService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),
};
