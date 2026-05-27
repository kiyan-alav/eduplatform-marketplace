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
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  const cookieToken = req.cookies?.accessToken;

  const token = bearerToken || cookieToken;

  if (!token) {
    return next(createHttpError(401, "Unauthorized: No token provided"));
  }

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    return next();
  } catch (err) {
    return next(createHttpError(401, "Invalid or expired token"));
  }
};
