import { Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { LessonListQuerySchema } from "../lesson.filter";
import { lessonUserService } from "./lesson.user.service";

export const lessonUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const query = LessonListQuerySchema.parse(req.query);
    const lessonData = await lessonUserService.getAll(query, +userId);

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

  getOne: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = paramsSchema.parse(req.params);
    const lesson = await lessonUserService.getOne(id, +userId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const lesson = await lessonUserService.create(req.body, +userId);

    const response = buildApiResponse({
      success: true,
      message: "Lesson created successfully!",
      data: lesson,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = paramsSchema.parse(req.params);
    const lesson = await lessonUserService.edit(id, req.body, +userId);

    const response = buildApiResponse({
      success: true,
      message: "Lesson updated successfully!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId as string;
    const { id } = paramsSchema.parse(req.params);
    const lesson = await lessonUserService.delete(id, +userId);

    const response = buildApiResponse({
      success: true,
      message: "Lesson deleted successfully!",
      data: lesson,
    });

    return res.status(200).json(response);
  }),
};
