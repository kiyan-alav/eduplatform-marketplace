import { Request, Response } from "express";
import { ENV } from "../../configs/env";
import { buildApiResponse } from "../../types/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { authService } from "./auth.service";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const userData = {
      ...req.body,
      avatar: req.file
        ? `${ENV.BASE_URL}/public/users/avatar/${req.file.filename}`
        : null,
    };

    await authService.register(userData);

    const response = buildApiResponse({
      success: true,
      message: "User registered successfully",
    });

    return res.status(201).json(response);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { accessToken, refreshToken, user } = await authService.login(
      req.body,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 8 * 60 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const response = buildApiResponse({
      success: true,
      message: "Login successful!",
      data: user,
    });

    return res.status(200).json(response);
  }),

  getMe: asyncHandler(async (req: Request, res: Response) => {}),

  refreshToken: asyncHandler(async (req: Request, res: Response) => {}),
};
