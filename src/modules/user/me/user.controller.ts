import { Response } from "express";
import { ENV } from "../../../configs/env";
import { AuthRequest } from "../../../middlewares/auth.middleware";
import { buildApiResponse } from "../../../types/apiResponse";
import { asyncHandler } from "../../../utils/asyncHandler";
import { userService } from "./user.service";

export const userController = {
  profile: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const avatar = req.file
      ? `${ENV.BASE_URL}/public/users/avatars/${req.file.filename}`
      : undefined;

    const user = await userService.updateProfile(userId, req.body, avatar);

    const response = buildApiResponse({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });

    return res.status(200).json(response);
  }),

  changePassword: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const { currentPassword, newPassword } = req.body;

    await userService.changePassword(userId, currentPassword, newPassword);

    const response = buildApiResponse({
      success: true,
      message: "Password changed successfully",
    });

    return res.status(200).json(response);
  }),

  applyForInstructor: asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.user!.userId;

    const documents =
      (req.files as Express.Multer.File[])?.map(
        (file) => `${ENV.BASE_URL}/public/instructor/docs/${file.filename}`,
      ) || [];

    const instructor = await userService.applyForInstructor(userId, documents);

    const response = buildApiResponse({
      success: true,
      message: "Instructor request submitted successfully",
      data: instructor,
    });

    return res.status(200).json(response);
  }),
};
