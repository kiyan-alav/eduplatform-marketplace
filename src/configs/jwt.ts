import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { Types } from "mongoose";
import { z } from "zod";
import { UserRole } from "../modules/user/user.types";
import { ENV } from "./env";

export interface JwtPayload {
  userId: string;
  roles: UserRole[];
}

export const signAccessToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ENV.ACCESS_SECRET_KEY, {
    expiresIn: ENV.ACCESS_EXPIRES as SignOptions["expiresIn"],
  });
};

export const signRefreshToken = (payload: JwtPayload) => {
  return jwt.sign(payload, ENV.REFRESH_SECRET_KEY, {
    expiresIn: ENV.REFRESH_EXPIRES as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = function (token: string): JwtPayload {
  return jwt.verify(token, ENV.ACCESS_SECRET_KEY) as JwtPayload;
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, ENV.REFRESH_SECRET_KEY) as JwtPayload;
};

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(ENV.BCRYPT_SALT);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const verifyPassword = async (pass: string, hashPass: string) => {
  const isValid = await bcrypt.compare(pass, hashPass);
  return isValid;
};

export const objectIdSchema = z
  .string()
  .refine((val) => Types.ObjectId.isValid(val), {
    message: "Invalid MongoDB ObjectId",
  });

export const paramsSchema = z.object({
  id: objectIdSchema,
});
