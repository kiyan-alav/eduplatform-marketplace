import { prisma } from "../../configs/prisma";
import { CreateNewUserData } from "./auth.types";

export async function findUserByEmailOrPhone(email: string, phone: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email }, { phone }],
    },
  });
}

export async function findUserByIdentifier(identifier: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ email: identifier }, { phone: identifier }],
    },
  });
}

export async function createNewUser(data: CreateNewUserData) {
  return prisma.user.create({
    data,
  });
}

export async function createStudentProfile(userId: number) {
  return prisma.studentProfile.create({
    data: { userId },
  });
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function findUserWithProfiles(id: number) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      studentProfile: true,
      adminProfile: true,
      instructorProfile: true,
    },
  });
}

export async function createRefreshToken(
  userId: number,
  tokenHash: string,
  expiresAt: Date,
) {
  return prisma.refresh.create({
    data: {
      userId,
      tokenHash,
      expiresAt,
    },
  });
}

export async function findRefreshToken(userId: number, tokenHash: string) {
  return prisma.refresh.findFirst({
    where: {
      userId,
      tokenHash,
    },
  });
}

export async function deleteAllRefreshTokens(userId: number) {
  return prisma.refresh.deleteMany({
    where: {
      userId,
    },
  });
}
