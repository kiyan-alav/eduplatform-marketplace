import { Document, model, PaginateModel, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IRefreshToken {
  user: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRefreshTokenDocument extends IRefreshToken, Document {}

export interface IRefreshTokenPaginateModel extends PaginateModel<IRefreshTokenDocument> {}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

RefreshTokenSchema.plugin(mongoosePaginate);

// ! TTL index => for auto delete expired token
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshTokenModel = model<
  IRefreshTokenDocument,
  IRefreshTokenPaginateModel
>("RefreshToken", RefreshTokenSchema);
