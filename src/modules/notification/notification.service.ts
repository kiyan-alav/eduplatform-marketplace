import { notificationRepository } from "./notification.repository";
import {
  CreateNotificationInput,
  NotificationListQuery,
} from "./notification.types";

export const notificationService = {
  async create(data: CreateNotificationInput) {
    return await notificationRepository.create({
      title: data.title,
      description: data.description,
      userId: data.userId,
      type: data.type,
    });
  },

  async getAll(query: NotificationListQuery, userId: number) {
    const { page, limit, isRead, type } = query;

    const result = await notificationRepository.getAll(
      {
        page,
        limit,
        isRead,
        type,
      },
      userId,
    );

    return result;
  },

  async getUnreadCount(userId: number) {
    const unreadCount = await notificationRepository.unReadCount(userId);
    return unreadCount;
  },

  async markAsRead(notificationId: number, userId: number) {
    const notification = await notificationRepository.markAsRead(
      userId,
      notificationId,
    );
    return notification;
  },

  async markAllAsRead(userId: number) {
    const notifications = await notificationRepository.markAllAsRead(userId);
    return notifications;
  },
};
