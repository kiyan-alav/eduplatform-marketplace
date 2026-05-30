import { Document, PaginateModel } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Filter Types ────────────────────────────────────────────
export interface ICategoryFilter extends CustomQueryOptions {
  name?: string;
}

// ! ─── Core Types ────────────────────────────────────────────
export interface ICategory {
  name: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICategoryDocument extends ICategory, Document {}

export interface ICategoryPaginateModel extends PaginateModel<ICategoryDocument> {}

// ! ─── Request Types ────────────────────────────────────────────
export interface ICreateCategoryRequest {
  name: string;
  slug?: string;
}

export interface IUpdateCategoryRequest {
  name?: string;
  slug?: string;
}
