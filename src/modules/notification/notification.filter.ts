import { z } from "zod";
import { NotificationType } from "../../generated/prisma/enums";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

export const NotificationListQuerySchema = BaseListQuerySchema.extend({
  isRead: z.coerce.boolean().optional(),
  type: z.enum(NotificationType).optional(),
});
