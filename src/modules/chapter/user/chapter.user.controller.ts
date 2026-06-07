import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { chapterUserService } from "./chapter.user.service";

export const chapterUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const chapterData = await chapterUserService.getAll(req.query, userId);

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

  getOne: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    const chapter = await chapterUserService.getOne(id, userId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const chapter = await chapterUserService.create(req.body, userId);

    const response = buildApiResponse({
      success: true,
      message: "Chapter created successfully!",
      data: chapter,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    const chapter = await chapterUserService.edit(id, req.body, userId);

    const response = buildApiResponse({
      success: true,
      message: "Chapter updated successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    const chapter = await chapterUserService.delete(id, userId);

    const response = buildApiResponse({
      success: true,
      message: "Chapter deleted successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),
};
