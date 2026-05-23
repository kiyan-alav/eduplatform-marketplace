import { Server } from "http";
import app from "./app";
import { connectToDB, gracefulShutdown } from "./configs/database";
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

const handleShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);

  if (server) {
    server.close(async () => {
      logger.info("HTTP server closed.");
      await gracefulShutdown();
    });
  } else {
    await gracefulShutdown();
  }
};

process.on("SIGTERM", () => handleShutdown("SIGTERM"));
process.on("SIGINT", () => handleShutdown("SIGINT"));

startServer();
