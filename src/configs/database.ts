import { logger } from "./logger";
import { prisma } from "./prisma";

export async function connectToDB() {
  try {
    await prisma.$connect();
    logger.info("Postgres connected successfully");
  } catch (error) {
    logger.error(error, "Could not connect to Postgres");
    process.exit(1);
  }
}

export async function disconnectFromDB() {
  await prisma.$disconnect();
}
