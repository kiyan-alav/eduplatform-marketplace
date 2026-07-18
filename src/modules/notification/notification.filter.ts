import { z } from "zod";
import { PaginationSchema } from "../../utils/baseFilterSchema";
import { FilterConfig } from "../../utils/query-builder";
import { INotificationFilter, NotificationType } from "./notification.types";

export const notificationFilterConfig: FilterConfig<INotificationFilter> = {
  searchable: [],
  regex: [],
  exact: ["isRead"],
  enumList: ["type" as keyof INotificationFilter],
};

export const NotificationListQuerySchema = PaginationSchema.extend({
  isRead: z.coerce.boolean().optional(),
  type: z
    .enum([
      NotificationType.ERROR,
      NotificationType.INFO,
      NotificationType.SUCCESS,
    ])
    .optional(),
});
