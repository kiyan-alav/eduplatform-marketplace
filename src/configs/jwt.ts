import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "./env";

export interface JwtPayload {
  userId: string;
  roles: string[];
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
