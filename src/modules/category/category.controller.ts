import { Request, Response } from "express";
import { buildApiResponse } from "../../types/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { categoryService } from "./category.service";

export const categoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const categoryData = await categoryService.getAll(req.query);

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: categoryData.docs,
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
