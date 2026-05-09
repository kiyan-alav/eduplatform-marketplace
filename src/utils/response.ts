import { Response } from "express";
import { PaginationMeta } from "../types/apiResponse";

export function successResponse<T>(
  res: Response,
  data: T,
  message = "Success",
  status = 200,
) {
  return res.status(status).json({
    success: true,
    message,
    data,
  });
}

export function paginatedResponse<T>(
  res: Response,
  data: T,
  meta: PaginationMeta,
  message = "Success",
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    meta,
  });
}

export function errorResponse(
  res: Response,
  message = "Error",
  status = 500,
  errors?: unknown,
) {
  return res.status(status).json({
    success: false,
    message,
    errors,
  });
}
