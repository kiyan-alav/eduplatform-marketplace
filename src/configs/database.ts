import mongoose from "mongoose";
import { ENV } from "./env";
import { logger } from "./logger";

export async function connectToDB() {
  try {
    // mongoose.set("strictQuery", true);
    mongoose.set("strictQuery", "throw");

    await mongoose.connect(ENV.MONGO_URI);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(error, "Could not connect to mongoDB");
    process.exit(1);
  }
}

export async function gracefulShutdown() {
  try {
    await mongoose.disconnect();
    logger.info("✅ MongoDB disconnected");
    process.exit(0);
  } catch (err) {
    logger.error(err, "❌ Error during shutdown");
    process.exit(1);
  }
}

