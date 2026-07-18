import { z } from "zod";
import { NotificationType } from "../../generated/prisma/enums";
import { NotificationListQuerySchema } from "./notification.filter";

// ! ─── Filter Types ────────────────────────────────────────────
export type NotificationListQuery = z.infer<typeof NotificationListQuerySchema>;

export type GetAllNotificationQuery = {
  page: number;
  limit: number;
  isRead?: boolean;
  type?: NotificationType;
};

// ! ─── Request Types ────────────────────────────────────────────
export interface CreateNotificationInput {
  user: number;
  title: string;
  description?: string;
  type: NotificationType;
}
