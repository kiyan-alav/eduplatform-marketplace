import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { notificationController } from "./notification.controller";
import { NotificationListQuerySchema } from "./notification.filter";

const notificationRouter = Router();

notificationRouter.get(
  "/list",
  authGuard,
  validateRequest(NotificationListQuerySchema, "query"),
  notificationController.getAll,
);

notificationRouter.get(
  "/unread-count",
  authGuard,
  notificationController.getUnreadCount,
);

notificationRouter.patch(
  "/:id/mark-as-read",
  authGuard,
  notificationController.markAsRead,
);

notificationRouter.patch(
  "/mark-all-as-read",
  authGuard,
  notificationController.markAllAsRead,
);

export default notificationRouter;
