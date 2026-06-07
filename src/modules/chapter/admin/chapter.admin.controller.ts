import { Request } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { chapterAdminService } from "./chapter.admin.service";

export const chapterAdminController = {
  getAll: asyncHandler(async (req: Request, res) => {
    const chapterData = await chapterAdminService.getAll(req.query);

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
    const chapter = await chapterAdminService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: Request, res) => {
    const chapter = await chapterAdminService.create(req.body);

    const response = buildApiResponse({
      success: true,
      message: "Chapter created successfully!",
      data: chapter,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: Request, res) => {
    const id = req.params.id as string;
    const chapter = await chapterAdminService.edit(id, req.body);

    const response = buildApiResponse({
      success: true,
      message: "Chapter updated successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res) => {
    const id = req.params.id as string;
    const chapter = await chapterAdminService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Chapter deleted successfully!",
      data: chapter,
    });

    return res.status(200).json(response);
  }),
};
