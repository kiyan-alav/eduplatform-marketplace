import { Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ChapterListQuerySchema } from "../chapter.filter";
import { chapterUserService } from "./chapter.user.service";

export const chapterUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;

    const query = ChapterListQuerySchema.parse(req.query);
    const chapterData = await chapterUserService.getAll(query, +userId);

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

  getOne: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = paramsSchema.parse(req.params);
    const chapter = await chapterUserService.getOne(id, +userId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const chapter = await chapterUserService.create(req.body, +userId);

    const response = buildApiResponse({
      success: true,
      message: "Chapter created successfully!",
      data: chapter,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = paramsSchema.parse(req.params);
    const chapter = await chapterUserService.edit(id, req.body, +userId);

    const response = buildApiResponse({
      success: true,
      message: "Chapter updated successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = paramsSchema.parse(req.params);
    const chapter = await chapterUserService.delete(id, +userId);

    const response = buildApiResponse({
      success: true,
      message: "Chapter deleted successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),
};
