import createHttpError from "http-errors";
import { PopulateOptions } from "mongoose";
import {
  hashPassword,
  signAccessToken,
  signRefreshToken,
  verifyPassword,
  verifyRefreshToken,
} from "../../configs/jwt";
import { hashToken } from "../../utils/token";
import "../user/profiles/admin/admin.model";
import "../user/profiles/instructor/instructor.model";
import "../user/profiles/student/student.model";
import { StudentProfile } from "../user/profiles/student/student.model";
import { User } from "../user/user.model";
import { UserRole } from "../user/user.types";
import { LoginData, RegisterData } from "./auth.types";
import { RefreshTokenModel } from "./refresh.model";

export const authService = {
  async register(data: RegisterData) {
    const { email, fullName, password, phone, avatar } = data;

    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      throw createHttpError(409, "User already exists");
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email,
      phone,
      fullName,
      passwordHash: hashedPassword,
      roles: [UserRole.STUDENT],
      avatar: avatar || null,
    });

    const studentProfile = await StudentProfile.create({
      user: user._id,
    });

    user.studentProfile = studentProfile._id;

    await user.save();
  },

  async login(data: LoginData) {
    const { identifier, password } = data;

    const existingUser = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

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
      userId: existingUser._id.toString(),
      roles: existingUser.roles,
    });

    const refreshToken = signRefreshToken({
      userId: existingUser._id.toString(),
      roles: existingUser.roles,
    });

    const tokenHash = hashToken(refreshToken);

    await RefreshTokenModel.create({
      user: existingUser._id,
      tokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    const userRoles = existingUser.roles;
    const populateFields: PopulateOptions[] = [];

    if (userRoles.includes(UserRole.ADMIN)) {
      populateFields.push({
        path: "adminProfile",
      });
    }
    if (userRoles.includes(UserRole.INSTRUCTOR)) {
      populateFields.push({
        path: "instructorProfile",
        select: "bio expertise socialLinks verification payoutInfo",
      });
    }
    if (userRoles.includes(UserRole.STUDENT)) {
      populateFields.push({
        path: "studentProfile",
        select: "interests",
      });
    }

    const userData = await User.findById(existingUser._id)
      .select("-__v -passwordHash")
      .populate(populateFields)
      .lean();

    return {
      accessToken,
      refreshToken,
      user: userData,
    };
  },

  async getMe(userId: string) {
    const existingUser = await User.findById(userId);

    if (!existingUser) {
      throw createHttpError(404, "User not found");
    }

    const userRoles = existingUser.roles;
    const populateFields: PopulateOptions[] = [];

    if (userRoles.includes(UserRole.ADMIN)) {
      populateFields.push({
        path: "adminProfile",
      });
    }
    if (userRoles.includes(UserRole.INSTRUCTOR)) {
      populateFields.push({
        path: "instructorProfile",
        select: "bio expertise socialLinks verification payoutInfo",
      });
    }
    if (userRoles.includes(UserRole.STUDENT)) {
      populateFields.push({
        path: "studentProfile",
        select: "interests",
      });
    }

    const user = await User.findById(userId)
      .select("-passwordHash -__v")
      .populate(populateFields)
      .lean();

    return user;
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

    const storedToken = await RefreshTokenModel.findOne({
      user: payload.userId,
      tokenHash,
    });

    if (!storedToken) {
      throw createHttpError(401, "Refresh token revoked");
    }

    if (storedToken.expiresAt < new Date()) {
      await storedToken.deleteOne();
      throw createHttpError(401, "Refresh token expired");
    }

    const accessToken = signAccessToken({
      userId: payload.userId,
      roles: payload.roles,
    });

    return { accessToken };
  },
};
