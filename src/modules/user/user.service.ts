import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { InstructorProfile } from "./profiles/instructor/instructor.model";
import { InstructorRequestStatus } from "./profiles/instructor/instructor.types";
import { StudentProfile } from "./profiles/student/student.model";
import { User } from "./user.model";
import { UserRole } from "./user.types";
import { UpdateProfileInput } from "./user.validation";

export const userService = {
  async updateProfile(
    userId: string,
    payload: UpdateProfileInput,
    avatar?: string,
  ) {
    const user = await User.findById(userId);
    if (!user) throw createHttpError.NotFound("User not found");

    if (typeof payload.fullName === "string") {
      user.fullName = payload.fullName.trim();
    }

    if (typeof avatar === "string") {
      user.avatar = avatar;
    }

    if (payload.studentProfile) {
      if (!user.studentProfile)
        throw createHttpError(400, "Student profile not found");
      await StudentProfile.findByIdAndUpdate(
        user.studentProfile,
        {
          $set: payload.studentProfile,
        },
        {
          runValidators: true,
        },
      );
    }

    if (payload.instructorProfile) {
      if (!user.instructorProfile)
        throw createHttpError(400, "Instructor profile not found");
      await InstructorProfile.findByIdAndUpdate(
        user.instructorProfile,
        {
          $set: payload.instructorProfile,
        },
        {
          runValidators: true,
        },
      );
    }

    await user.save();
    return user;
  },

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await User.findById(userId);

    if (!user) throw createHttpError.NotFound("User not found");

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw createHttpError.BadRequest("Current password is incorrect");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.passwordHash = hashedPassword;

    await user.save();

    return true;
  },

  async applyForInstructor(userId: string, documents: string[]) {
    const user = await User.findById(userId);

    if (!user) throw createHttpError.NotFound("User not found");

    if (user.instructorProfile) {
      throw createHttpError.BadRequest("Instructor request already submitted");
    }

    const instructorProfile = await InstructorProfile.create({
      user: user._id,
      verification: {
        documents,
        status: InstructorRequestStatus.PENDING,
        isVerified: false,
      },
    });

    user.instructorProfile = instructorProfile._id;

    if (!user.roles.includes(UserRole.INSTRUCTOR)) {
      user.roles.push(UserRole.INSTRUCTOR);
    }

    await user.save();

    return instructorProfile;
  },
};
