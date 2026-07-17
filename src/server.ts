import { Server } from "http";
import app from "./app";
import { connectToDB, disconnectFromDB } from "./configs/database";
import { ENV } from "./configs/env";
import { logger } from "./configs/logger";

let server: Server;

async function startServer() {
  try {
    await connectToDB();

    server = app.listen(ENV.PORT, () => {
      logger.info(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error(error, "Failed to start server");
    process.exit(1);
  }
}

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async (err) => {
      if (err) {
        logger.error(err, "Error closing server:");
        process.exit(1);
      }

      try {
        await disconnectFromDB();
        logger.info("Database connection closed. Exiting process.");
        process.exit(0);
      } catch (dbErr) {
        logger.error(dbErr, "Error closing database:");
        process.exit(1);
      }
    });
  } else {
    process.exit(0);
  }
};

const unexpectedErrorHandler = (error: Error) => {
  if (server) {
    server.close(async () => {
      await disconnectFromDB();
      logger.error(error, "Unexpected error:");
      process.exit(1);
    });
  } else {
    process.exit(0);
  }
};

process.on("unhandledRejection", unexpectedErrorHandler);
process.on("uncaughtException", unexpectedErrorHandler);
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();
