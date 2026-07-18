import { prisma } from "../../configs/prisma";
import { Prisma } from "../../generated/prisma/client";
import { buildPagination, paginationMeta } from "../../types/buildPagination";
import {
  CreateNotificationInput,
  GetAllNotificationQuery,
} from "./notification.types";

export const notificationRepository = {
  async getAll(params: GetAllNotificationQuery, userId: number) {
    const { limit, page, isRead, type } = params;

    const { skip, take } = buildPagination({ limit, page });

    const where: Prisma.NotificationWhereInput = {
      ...(isRead && {
        isRead: {
          equals: isRead,
        },
      }),
      ...(type && {
        type: {
          equals: type,
        },
      }),
      userId: userId,
    };

    const [items, totalDocs] = await prisma.$transaction([
      prisma.notification.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.notification.count({ where }),
    ]);

    const { hasNextPage, hasPrevPage, totalPages } = paginationMeta({
      limit,
      page,
      totalDocs,
    });

    return {
      items,
      page,
      limit,
      totalDocs,
      totalPages,
      hasNextPage,
      hasPrevPage,
    };
  },

  async unReadCount(userId: number) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false,
      },
    });
  },

  async markAsRead(userId: number, notificationId: number) {
    return prisma.notification.update({
      where: {
        id: notificationId,
        userId: userId,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  async markAllAsRead(userId: number) {
    return prisma.notification.updateMany({
      where: {
        userId: userId,
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  },

  async create({ title, type, user, description }: CreateNotificationInput) {
    return prisma.notification.create({
      data: {
        title,
        type,
        description: description || null,
        userId: user,
      },
    });
  },
};
