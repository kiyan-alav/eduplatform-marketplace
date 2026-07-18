import { Response } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { buildApiResponse } from "../../types/apiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { NotificationListQuerySchema } from "./notification.filter";
import { notificationService } from "./notification.service";

export const notificationController = {
  getAll: asyncHandler(async (req: AuthRequest, res: Response) => {
    const query = NotificationListQuerySchema.parse(req.query);
    const notificationData = await notificationService.getAll(
      query,
      +req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: notificationData.totalDocs,
      meta: {
        limit: notificationData.limit,
        page: notificationData.page as number,
        total: notificationData.totalDocs,
        totalPages: notificationData.totalPages,
        hasNextPage: notificationData.hasNextPage,
        hasPrevPage: notificationData.hasPrevPage,
      },
    });

    return res.status(200).json(response);
  }),

  getUnreadCount: asyncHandler(async (req: AuthRequest, res: Response) => {
    const unreadCount = await notificationService.getUnreadCount(
      +req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: { unreadCount },
    });

    return res.status(200).json(response);
  }),

  markAsRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notificationId = req.params.id as string;
    const notification = await notificationService.markAsRead(
      +notificationId,
      +req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: notification,
    });

    return res.status(200).json(response);
  }),

  markAllAsRead: asyncHandler(async (req: AuthRequest, res: Response) => {
    const notifications = await notificationService.markAllAsRead(
      +req.user!.userId,
    );

    const response = buildApiResponse({
      success: true,
      message: "OK!",
      data: notifications,
    });

    return res.status(200).json(response);
  }),
};
