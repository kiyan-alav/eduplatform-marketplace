import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { AuthRequest } from "./auth.middleware";

export const roleGuard =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!roles.includes(req.user.role)) {
      return next(createHttpError(403, "Forbidden"));
    }

    next();
  };
