import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import {
  INotificationDocument,
  INotificationPaginateModel,
  NotificationType,
} from "./notification.types";

const NotificationSchema = new Schema<INotificationDocument>(
  {
    title: {
      type: String,
      required: [true, "Notification title is required"],
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      lowercase: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      lowercase: true,
      required: [true, "Type must be defined!"],
    },
  },
  {
    timestamps: true,
  },
);

NotificationSchema.plugin(mongoosePaginate);

NotificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

export const Notification = model<
  INotificationDocument,
  INotificationPaginateModel
>("Notification", NotificationSchema);
