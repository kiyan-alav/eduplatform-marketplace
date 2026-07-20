import { Request, Response } from "express";
import { ENV } from "../../../configs/env";
import { paramsSchema } from "../../../configs/jwt";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CourseListQuerySchema } from "../course.filter";
import { courseUserService } from "./course.user.service";

export const courseUserController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = CourseListQuerySchema.parse(req.query);
    const courseData = await courseUserService.getAll(query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: courseData.items,
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
    const userId = req.user?.userId as string;

    const { id } = paramsSchema.parse(req.params);

    const course = await courseUserService.getOne(id, +userId as number);

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
      instructorId: req.user?.userId,
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
    const { id } = paramsSchema.parse(req.params);

    const cover = req.file
      ? `${ENV.BASE_URL}/public/courses/covers/${req.file.filename}`
      : undefined;

    const bodyData = {
      ...req.body,
      instructorId: req.user?.userId,
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
    const { id } = paramsSchema.parse(req.params);
    const course = await courseUserService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Course deleted successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
