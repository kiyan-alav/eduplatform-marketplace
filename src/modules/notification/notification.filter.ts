import { z } from "zod";
import { NotificationType } from "../../generated/prisma/enums";
import { BaseListQuerySchema } from "../../utils/baseFilterSchema";

const booleanQuerySchema = z.union([
  z.boolean(),
  z.enum(["true", "false"]).transform((value) => value === "true"),
]);

export const NotificationListQuerySchema = BaseListQuerySchema.extend({
  isRead: booleanQuerySchema.optional(),
  type: z.enum(NotificationType).optional(),
});
