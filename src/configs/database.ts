import mongoose from "mongoose";
import { ENV } from "./env";
import { logger } from "./logger";

export async function connectToDB() {
  try {
    mongoose.set("strictQuery", true);

    await mongoose.connect(ENV.MONGO_URI);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(error, "Could not connect to mongoDB");
    process.exit(1);
  }
}

export const disconnectDB = () => mongoose.disconnect();
