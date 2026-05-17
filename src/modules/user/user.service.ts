import bcrypt from "bcryptjs";
import createHttpError from "http-errors";
import { InstructorProfile } from "./profiles/instructor/instructor.model";
import { InstructorRequestStatus } from "./profiles/instructor/instructor.types";
import { StudentProfile } from "./profiles/student/student.model";
import { User } from "./user.model";
import { UserRole } from "./user.types";
import { UpdateProfileInput } from "./user.validation";

export const userService = {
  async updateProfile(userId: string, payload: UpdateProfileInput, avatar?: string) {
    const user = await User.findById(userId);
    if (!user) throw createHttpError.NotFound("User not found");

    if (payload.fullName) {
      user.fullName = payload.fullName;
    }

    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();

    if (payload.studentProfile && user.studentProfile) {
      await StudentProfile.findByIdAndUpdate(user.studentProfile, {
        $set: payload.studentProfile,
      });
    }

    if (payload.instructorProfile && user.instructorProfile) {
      await InstructorProfile.findByIdAndUpdate(user.instructorProfile, {
        $set: payload.instructorProfile,
      });
    }

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
