import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";
import { ENV } from "../../configs/env";
import { PrismaClient, UserRole } from "../../generated/prisma/client";

const connectionString = `${ENV.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
  adapter,
  log:
    ENV.NODE_ENV === "development"
      ? ["query", "info", "warn", "error"]
      : ["error"],
});

async function createAdmin() {
  try {
    console.log("Connecting to PostgreSQL via Prisma...");

    const userId = 3;

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error(`User not found with id: ${userId}`);
    }

    const admin = await prisma.adminProfile.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        adminProfile: {
          connect: {
            id: admin.id,
          },
        },
        roles: {
          push: UserRole.ADMIN,
        },
      },
    });

    console.log("Admin created successfully:", admin);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Prisma disconnected");
  }
}

createAdmin();
