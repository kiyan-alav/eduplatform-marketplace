import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { NotificationType } from "../../../generated/prisma/enums";
import { notificationService } from "../../notification/notification.service";
import { UpdateProfileInput } from "../user.validation";
import { userRepository } from "./user.repository";

export const userService = {
  async updateProfile(
    userId: number,
    payload: UpdateProfileInput,
    avatar?: string,
  ) {
    const user = await userRepository.findUserByIdWithProfiles(userId);

    if (!user) throw createHttpError.NotFound("User not found");

    if (typeof payload.fullName === "string" || typeof avatar === "string") {
      await userRepository.updateUser(userId, {
        ...(typeof payload.fullName === "string"
          ? { fullName: payload.fullName.trim() }
          : {}),
        ...(typeof avatar === "string" ? { avatar } : {}),
      });
    }

    if (payload.studentProfile) {
      if (!user.studentProfile) {
        throw createHttpError.BadRequest("Student profile not found");
      }

      await userRepository.updateStudentProfile(user.studentProfile.id, {
        ...payload.studentProfile,
      });
    }

    if (payload.instructorProfile) {
      if (!user.instructorProfile) {
        throw createHttpError.BadRequest("Instructor profile not found");
      }

      await userRepository.updateInstructorProfile(user.instructorProfile.id, {
        ...payload.instructorProfile,
      });
    }

    return userRepository.findUserByIdWithProfiles(userId);
  },

  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await userRepository.findUserById(userId);

    if (!user) {
      throw createHttpError.NotFound("User not found");
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw createHttpError.BadRequest("Current password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.updatePassword(userId, hashedPassword);

    return true;
  },

  async applyForInstructor(userId: number, documents: string[]) {
    try {
      const instructorProfile =
        await userRepository.createInstructorApplication(userId, documents);

      await notificationService.create({
        user: userId,
        title: "Your request has been submitted",
        description:
          "After review, your instructor application will be approved or rejected. You will receive a notification once the review is complete.",
        type: NotificationType.SUCCESS,
      });

      return instructorProfile;
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "USER_NOT_FOUND") {
          throw createHttpError.NotFound("User not found");
        }

        if (error.message === "INSTRUCTOR_REQUEST_ALREADY_SUBMITTED") {
          throw createHttpError.BadRequest(
            "Instructor request already submitted",
          );
        }
      }

      throw error;
    }
  },
};
