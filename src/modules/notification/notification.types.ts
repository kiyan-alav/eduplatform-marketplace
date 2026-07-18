import { z } from "zod";
import { NotificationType } from "../../generated/prisma/enums";
import { PaginationParams } from "../../types/buildPagination";
import { NotificationListQuerySchema } from "./notification.filter";

// ! ─── Filter Types ────────────────────────────────────────────
export type NotificationListQuery = z.infer<typeof NotificationListQuerySchema>;

export interface GetAllNotificationQuery extends PaginationParams {
  isRead?: boolean;
  type?: NotificationType;
}

// ! ─── Request Types ────────────────────────────────────────────
export interface CreateNotificationInput {
  userId: number;
  title: string;
  description?: string;
  type: NotificationType;
}
