import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { InstructorProfile } from "../modules/user/profiles/instructor/instructor.model";
import { UserRole } from "../modules/user/user.types";
import { AuthRequest } from "./auth.middleware";

type ConditionFn = (req: AuthRequest) => Promise<boolean>;

export const roleGuard = (roles: UserRole[] = [], condition?: ConditionFn) => {
  return async (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) return next(createHttpError(401, "Unauthorized"));

    const isAuthorizedRole =
      roles.length === 0 || req.user.roles.some((role) => roles.includes(role));

    const isAdmin = req.user.roles.includes(UserRole.ADMIN);

    if (isAdmin) return next();

    if (!isAuthorizedRole) return next(createHttpError(403, "Forbidden"));

    if (condition) {
      try {
        const isConditionMet = await condition(req);
        if (!isConditionMet) {
          return next(
            createHttpError(403, "Condition not met (e.g. not verified)"),
          );
        }
      } catch (error) {
        return next(createHttpError(500, "Error checking permissions"));
      }
    }

    next();
  };
};

export const isVerifiedInstructor: ConditionFn = async (req) => {
  const instructor = await InstructorProfile.findOne({
    user: req.user!.userId,
  });
  return !!instructor?.verification.isVerified;
};
