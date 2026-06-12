import { buildQueryFilters } from "../../utils/query-builder";
import { notificationFilterConfig } from "./notification.filter";
import { Notification } from "./notification.model";
import {
  CreateNotificationInput,
  INotificationFilter,
} from "./notification.types";

export const notificationService = {
  async create(data: CreateNotificationInput) {
    return await Notification.create({
      title: data.title,
      description: data.description || null,
      user: data.user,
      type: data.type,
    });
  },

  async getAll(filters: INotificationFilter, userId: string) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      notificationFilterConfig,
    );

    mongoFilter.user = userId;

    const result = await Notification.paginate(
      { ...mongoFilter, user: userId },
      options,
    );

    return result;
  },

  async getUnreadCount(userId: string) {
    const unreadCount = await Notification.countDocuments({
      user: userId,
      isRead: false,
    });
    return unreadCount;
  },

  async markAsRead(notificationId: string, userId: string) {
    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { isRead: true, readAt: new Date() },
    );
    return notification;
  },

  async markAllAsRead(userId: string) {
    const notifications = await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true, readAt: new Date() },
    );
    return notifications;
  },
};
