import app from "./app";
import { connectToDB } from "./configs/database";
import { ENV } from "./configs/env";
import { logger } from "./configs/logger";

async function startServer() {
  try {
    await connectToDB();

    app.listen(ENV.PORT, () => {
      logger.info(`Server running on port ${ENV.PORT}`);
    });
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }
}

startServer();
