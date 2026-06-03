import { Document, PaginateModel, Types } from "mongoose";
import { CustomQueryOptions } from "../../utils/query-builder";

// ! ─── Enum Types ────────────────────────────────────────────
export enum NotificationType {
  INFO = "INFO",
  ERROR = "ERROR",
  SUCCESS = "SUCCESS",
}

// ! ─── Filter Types ────────────────────────────────────────────
export interface INotificationFilter extends CustomQueryOptions {
  user?: string;
  isRead?: boolean;
  type?: NotificationType;
}

// ! ─── Core Types ────────────────────────────────────────────
export interface INotification {
  title: string;
  description: string;
  user: Types.ObjectId;
  isRead: boolean;
  type: NotificationType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface INotificationDocument extends INotification, Document {}

export interface INotificationPaginateModel extends PaginateModel<INotificationDocument> {}
