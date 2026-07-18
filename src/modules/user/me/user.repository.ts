import { prisma } from "../../../configs/prisma";
import { InstructorRequestStatus, Prisma, UserRole } from "../../../generated/prisma/client";

export const userRepository = {
  async findUserById(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },

  async findUserByIdWithProfiles(userId: number) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        studentProfile: true,
        instructorProfile: true,
      },
    });
  },

  async updateUser(userId: number, data: Prisma.UserUpdateInput) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  async updateStudentProfile(
    profileId: number,
    data: Prisma.StudentProfileUpdateInput,
  ) {
    return prisma.studentProfile.update({
      where: { id: profileId },
      data,
    });
  },

  async updateInstructorProfile(
    profileId: number,
    data: Prisma.InstructorProfileUpdateInput,
  ) {
    return prisma.instructorProfile.update({
      where: { id: profileId },
      data,
    });
  },

  async createInstructorApplication(userId: number, documents: string[]) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.findUnique({
        where: { id: userId },
        include: {
          instructorProfile: true,
        },
      });

      if (!user) {
        throw new Error("USER_NOT_FOUND");
      }

      if (user.instructorProfile) {
        throw new Error("INSTRUCTOR_REQUEST_ALREADY_SUBMITTED");
      }

      const instructorProfile = await tx.instructorProfile.create({
        data: {
          userId,
          verificationDocuments: documents,
          verificationStatus: InstructorRequestStatus.PENDING,
          isVerified: false,
        },
      });

      const roles = user.roles.includes(UserRole.INSTRUCTOR)
        ? user.roles
        : [...user.roles, UserRole.INSTRUCTOR];

      await tx.user.update({
        where: { id: userId },
        data: {
          roles,
        },
      });

      return instructorProfile;
    });
  },

  async updatePassword(userId: number, passwordHash: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });
  },
};
