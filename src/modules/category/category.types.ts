import { z } from "zod";
import { CategoryListQuerySchema } from "./category.filter";
import { PaginationParams } from "../../types/buildPagination";

// ! ─── Filter Types ────────────────────────────────────────────
export type CategoryListQuery = z.infer<typeof CategoryListQuerySchema>;

export interface GetAllCategoryQuery extends PaginationParams {
  name?: string;
};

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateCategoryRequest {
  name: string;
  slug: string;
}

export interface IUpdateCategoryRequest {
  name?: string;
  slug?: string;
}
