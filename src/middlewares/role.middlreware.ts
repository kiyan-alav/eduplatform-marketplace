import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { UserRole } from "../modules/user/user.types";
import { AuthRequest } from "./auth.middleware";
import { InstructorProfile } from "../modules/user/profiles/instructor/instructor.model";

export const roleGuard =
  (...roles: UserRole[]) =>
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

export const instructorVerifiedGuard = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;

  if (!userId) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const instructor = await InstructorProfile.findOne({ user: userId });

  if (!instructor || !instructor.verification.isVerified) {
    return next(
      createHttpError(403, "Your instructor account is not verified"),
    );
  }

  next();
};
