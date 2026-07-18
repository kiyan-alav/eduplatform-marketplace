import { Request, Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { ChapterListQuerySchema } from "../chapter.filter";
import { chapterAdminService } from "./chapter.admin.service";

export const chapterAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = ChapterListQuerySchema.parse(req.query);
    const chapterData = await chapterAdminService.getAll(query);

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
    const chapter = await chapterAdminService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const chapter = await chapterAdminService.create(req.body);

    const response = buildApiResponse({
      success: true,
      message: "Chapter created successfully!",
      data: chapter,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const chapter = await chapterAdminService.edit(id, req.body);

    const response = buildApiResponse({
      success: true,
      message: "Chapter updated successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const chapter = await chapterAdminService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Chapter deleted successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),
};
