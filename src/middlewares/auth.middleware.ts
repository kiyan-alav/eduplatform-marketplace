import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { JwtPayload, verifyAccessToken } from "../configs/jwt";

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authGuard = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return next(createHttpError(401, "Unauthorized"));
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
