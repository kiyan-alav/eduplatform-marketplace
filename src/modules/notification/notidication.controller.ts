import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { buildApiResponse } from "../../types/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { notificationService } from "./notification.service";

export const notificationController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notificationData = await notificationService.getAll(
      req.query,
      req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: notificationData.docs,
      meta: {
        limit: notificationData.limit,
        page: notificationData.page as number,
        total: notificationData.totalDocs,
        totalPages: notificationData.totalPages,
        hasNextPage: notificationData.hasNextPage,
        hasPrevPage: notificationData.hasPrevPage,
      },
    });

    res.status(200).json(response);
  }),

  getUnreadCount: asyncHandler(async (req: AuthRequest, res: Response) => {
    const unreadCount = await notificationService.getUnreadCount(
      req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: { unreadCount },
    });

    res.status(200).json(response);
  }),

  markAsRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notificationId = req.params.id as string;
    const notification = await notificationService.markAsRead(
      notificationId,
      req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: notification,
    });

    res.status(200).json(response);
  }),

  markAllAsRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await notificationService.markAllAsRead(
      req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: notifications,
    });

    res.status(200).json(response);
  }),
};
