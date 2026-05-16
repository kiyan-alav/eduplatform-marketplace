import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { AuthRequest } from "./auth.middleware";

export const roleGuard =
  (...roles: string[]) =>
  (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));

    if (!hasRole) {
      return next(createHttpError(403, "Forbidden"));
    }

    next();
  };
