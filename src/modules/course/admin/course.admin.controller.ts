import { Request, Response } from "express";
import { ENV } from "../../../configs/env";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { courseAdminService } from "./course.admin.service";
import { CourseListQuerySchema } from "../course.filter";
import { paramsSchema } from "../../../configs/jwt";

export const courseAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = CourseListQuerySchema.parse(req.query);
    const courseData = await courseAdminService.getAll(query);

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

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const course = await courseAdminService.getOne(id);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: course,
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const cover = req.file
      ? `${ENV.BASE_URL}/public/courses/covers/${req.file.filename}`
      : undefined;

    const course = await courseAdminService.create(req.body, cover);

    const response = buildApiResponse({
      success: true,
      message: "Course created successfully!",
      data: course,
    });

    return res.status(201).json(response);
  }),

  edit: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);

    const cover = req.file
      ? `${ENV.BASE_URL}/public/courses/covers/${req.file.filename}`
      : undefined;

    const course = await courseAdminService.edit(id, req.body, cover);

    const response = buildApiResponse({
      success: true,
      message: "Course updated successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const course = await courseAdminService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Course deleted successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),

  togglePublish: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const course = await courseAdminService.togglePublish(id);

    const response = buildApiResponse({
      success: true,
      message: "Course publish status updated successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
