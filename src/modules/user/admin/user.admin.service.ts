import createHttpError from "http-errors";
import {
  InstructorRequestStatus,
  UserRole,
} from "../../../generated/prisma/enums";
import { InstructorRequestQuery, UserListQuery } from "../user.types";
import { adminUserRepository } from "./user.admin.repository";

export const adminUserService = {
  async userList(query: UserListQuery) {
    const { page, limit, email, phone, role } = query;

    const result = await adminUserRepository.getAll({
      page,
      limit,
      email,
      phone,
      role,
    });

    return result;
  },

  async singleUser(id: number) {
    const userDoc = await adminUserRepository.getWithProfiles(id);

    if (!userDoc) {
      throw createHttpError(404, "User not found");
    }

    return userDoc;
  },

  async instructorRequestsList(query: InstructorRequestQuery) {
    const { page, limit, email, phone } = query;

    const result = await adminUserRepository.getAllInstructorRequest({
      page,
      limit,
      email,
      phone,
    });

    return result;
  },

  async applyInstructorRequest(id: number) {
    const user = await adminUserRepository.getUserWithInstructorProfile(id);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!user.instructorProfile) {
      throw createHttpError(400, "User has no instructor request");
    }

    if (user.instructorProfile.status === InstructorRequestStatus.APPROVED) {
      throw createHttpError(400, "Instructor request already approved");
    }

    const roles = user.roles.includes(UserRole.INSTRUCTOR)
      ? user.roles
      : [...user.roles, UserRole.INSTRUCTOR];

    return adminUserRepository.updateInstructorRequestStatus({
      userId: id,
      isVerified: true,
      status: InstructorRequestStatus.APPROVED,
      roles,
    });
  },

  async rejectInstructorRequest(id: number) {
    const user = await adminUserRepository.getUserWithInstructorProfile(id);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!user.instructorProfile) {
      throw createHttpError(400, "User has no instructor request");
    }

    if (user.instructorProfile.status === InstructorRequestStatus.REJECTED) {
      throw createHttpError(400, "Instructor request already rejected");
    }

    const roles = user.roles.filter((role) => role !== UserRole.INSTRUCTOR);

    return adminUserRepository.updateInstructorRequestStatus({
      userId: id,
      isVerified: false,
      status: InstructorRequestStatus.REJECTED,
      roles,
    });
  },
};
