import { Request, Response } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CategoryListQuerySchema } from "../category.filter";
import { categoryAdminService } from "./category.admin.service";

export const categoryAdminController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = CategoryListQuerySchema.parse(req.query);
    const categoryData = await categoryAdminService.getAll(query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: categoryData.items,
      meta: {
        limit: categoryData.limit,
        page: categoryData.page as number,
        total: categoryData.totalDocs,
        totalPages: categoryData.totalPages,
        hasNextPage: categoryData.hasNextPage,
        hasPrevPage: categoryData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const category = await categoryAdminService.create(req.body);

    const response = buildApiResponse({
      success: true,
      message: "Category created successfully!",
      data: category,
    });

    return res.status(201).json(response);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const category = await categoryAdminService.update(id, req.body);

    const response = buildApiResponse({
      success: true,
      message: "Category updated successfully!",
      data: category,
    });

    return res.status(200).json(response);
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const { id } = paramsSchema.parse(req.params);
    const category = await categoryAdminService.delete(id);

    const response = buildApiResponse({
      success: true,
      message: "Category deleted successfully!",
      data: category,
    });

    return res.status(200).json(response);
  }),
};
