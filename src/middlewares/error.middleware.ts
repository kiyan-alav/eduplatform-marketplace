import { NextFunction, Request, Response } from "express";
import { ENV } from "../configs/env";
import { logger } from "../configs/logger";
import { buildApiResponse } from "../types/apiResponse";

export function errorMiddleware(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  if (status >= 500) {
    logger.error({
      status,
      message,
      stack: err.stack,
    });
  } else {
    logger.warn({
      status,
      message,
    });
  }

  const response = buildApiResponse({
    success: false,
    message,
    ...(ENV.NODE_ENV === "development" && { stack: err.stack }),
  });

  res.status(status).json(response);
}
