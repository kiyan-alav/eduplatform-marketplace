import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { lessonAdminService } from "./lesson.admin.service";

export const lessonAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const lessonData = await lessonAdminService.getAll(req.query);

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
    const lesson = await lessonAdminService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const lesson = await lessonAdminService.create(req.body);

    const response = buildApiResponse({
      success: true,
      message: "Lesson created successfully!",
      data: lesson,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const lesson = await lessonAdminService.edit(id, req.body);

    const response = buildApiResponse({
      success: true,
      message: "Lesson updated successfully!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const lesson = await lessonAdminService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Lesson deleted successfully!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),
};
