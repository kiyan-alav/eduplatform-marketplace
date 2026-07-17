import createHttpError from "http-errors";
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../../configs/jwt";
import { UserRole } from "../../generated/prisma/enums";
import { hashToken } from "../../utils/token";
import {
  createNewUser,
  createRefreshToken,
  createStudentProfile,
  deleteAllRefreshTokens,
  findRefreshToken,
  findUserByEmailOrPhone,
  findUserByIdentifier,
  findUserWithProfiles,
} from "./auth.repository";
import { LoginData, RegisterData } from "./auth.types";

export const authService = {
  async register(data: RegisterData) {
    const { email, fullName, password, phone, avatar } = data;

    const existingUser = await findUserByEmailOrPhone(email, phone);
    if (existingUser) {
      throw createHttpError(409, "User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await createNewUser({
      email,
      phone,
      fullName,
      passwordHash: hashedPassword,
      roles: [UserRole.STUDENT],
      avatar: avatar || null,
    });

    await createStudentProfile(user.id);
  },

  async login(data: LoginData) {
    const { identifier, password } = data;

    const existingUser = await findUserByIdentifier(identifier);

    if (!existingUser) {
      throw createHttpError(404, "User not found");
    }

    const isPasswordMath = await verifyPassword(
      password,
      existingUser.passwordHash,
    );

    if (!isPasswordMath) {
      throw createHttpError(404, "Identifier or password is wrong!");
    }

    const accessToken = signAccessToken({
      userId: existingUser.id.toString(),
      roles: existingUser.roles,
    });

    const refreshToken = signRefreshToken({
      userId: existingUser.id.toString(),
      roles: existingUser.roles,
    });

    await createRefreshToken(
      existingUser.id,
      hashToken(refreshToken),
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    const user = await findUserWithProfiles(existingUser.id);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const { passwordHash, ...userData } = user;

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  },

  async getMe(userId: string) {
    const user = await findUserWithProfiles(Number(userId));

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    const { passwordHash, ...userData } = user;

    return userData;
  },

  async refreshToken(token: string) {
    if (!token) {
      throw createHttpError(401, "Refresh token missing!");
    }

    let payload;

    try {
      payload = verifyRefreshToken(token);
    } catch (error) {
      throw createHttpError(401, "Invalid refresh token");
    }

    const tokenHash = hashToken(token);

    const storedToken = await findRefreshToken(
      Number(payload.userId),
      tokenHash,
    );

    if (!storedToken) {
      throw createHttpError(401, "Refresh token revoked");
    }

    if (storedToken.expiresAt < new Date()) {
      await deleteAllRefreshTokens(storedToken.id);

      throw createHttpError(401, "Refresh token expired");
    }

    const accessToken = signAccessToken({
      userId: payload.userId,
      roles: payload.roles,
    });

    return { accessToken };
  },
};
