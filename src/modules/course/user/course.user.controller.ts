import { Request, Response } from "express";
import { ENV } from "../../../configs/env";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { courseUserService } from "./course.user.service";

export const courseUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    const courseData = await courseUserService.getAll(req.query, userId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: courseData.docs,
      meta: {
        limit: courseData.limit,
        page: courseData.page as number,
        total: courseData.totalDocs,
        totalPages: courseData.totalPages,
        hasNextPage: courseData.hasNextPage,
        hasPrevPage: courseData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  getOne: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    const id = req.params.id as string;
    const course = await courseUserService.getOne(id, userId);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: course,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: AuthRequest, res: Response) => {
    const cover = req.file
      ? `${ENV.BASE_URL}/public/courses/covers/${req.file.filename}`
      : undefined;

    const bodyData = {
      ...req.body,
      instructor: req.user?.userId,
    };

    const course = await courseUserService.create(bodyData, cover);

    const response = buildApiResponse({
      success: true,
      message: "Course created successfully!",
      data: course,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: AuthRequest, res: Response) => {
    const id = req.params.id as string;

    const cover = req.file
      ? `${ENV.BASE_URL}/public/courses/covers/${req.file.filename}`
      : undefined;

    const bodyData = {
      ...req.body,
      instructor: req.user?.userId,
    };

    const course = await courseUserService.edit(id, bodyData, cover);

    const response = buildApiResponse({
      success: true,
      message: "Course updated successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const course = await courseUserService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Course deleted successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
