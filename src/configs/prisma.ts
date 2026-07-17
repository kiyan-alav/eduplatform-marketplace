import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { ENV } from "./env";

const connectionString = `${ENV.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log:
    ENV.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

export { prisma };
