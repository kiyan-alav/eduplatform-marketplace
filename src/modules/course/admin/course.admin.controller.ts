import { Request, Response } from "express";
import { ENV } from "../../../configs/env";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { courseAdminService } from "./course.admin.service";

export const courseAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const courseData = await courseAdminService.getAll(req.query);

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

  getOne: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
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
      ? `${ENV.BASE_URL}/public/courses/covers`
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
    const id = req.params.id as string;
    const course = await courseAdminService.edit(id, req.body);

    const response = buildApiResponse({
      success: true,
      message: "Course updated successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const course = await courseAdminService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Course deleted successfully!",
      data: course,
    });

    return res.status(200).json(response);
  }),
};
