import { Request, Response } from "express";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CategoryListQuerySchema } from "../category.filter";
import { categoryService } from "./category.service";

export const categoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = CategoryListQuerySchema.parse(req.query);
    const categoryData = await categoryService.getAll(query);

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
};
