import createHttpError from "http-errors";
import { buildQueryFilters } from "../../utils/query-builder";
import {
  IInstructorProfileDocument,
  InstructorRequestStatus,
} from "./profiles/instructor/instructor.types";
import {
  instructorRequestsFilterConfig,
  userFilterConfig,
} from "./user.filter";
import { User } from "./user.model";
import { IUserFilter, UserRole } from "./user.types";

export const adminUserService = {
  async userList(filters: IUserFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      userFilterConfig,
    );

    const result = await User.paginate(mongoFilter, options);

    return result;
  },

  async singleUser(id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    return user;
  },

  async instructorRequestsList(filters: IUserFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      instructorRequestsFilterConfig,
    );

    mongoFilter["instructorProfile"] = { $ne: null };

    const result = await User.paginate(mongoFilter, {
      ...options,
      populate: [
        {
          path: "instructorProfile",
          select: "verification",
        },
      ],
    });

    return result;
  },

  async singleInstructorRequest(id: string) {
    const user = await User.findById(id).populate({
      path: "instructorProfile",
      select: "verification bio expertise socialLinks payoutInfo",
    });

    if (!user) {
      throw createHttpError(404, "User not found");
    }
  },

  async applyInstructorRequest(id: string) {
    const user = await User.findById(id)
      .populate<{
        instructorProfile: IInstructorProfileDocument;
      }>("instructorProfile")
      .lean();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!user.instructorProfile) {
      throw createHttpError(400, "User has no instructor request");
    }

    const instructorProfile = user.instructorProfile;

    if (
      instructorProfile.verification.status === InstructorRequestStatus.APPROVED
    ) {
      throw createHttpError(400, "Instructor request already approved");
    }

    instructorProfile.verification.status = InstructorRequestStatus.APPROVED;
    instructorProfile.verification.isVerified = true;

    await instructorProfile.save();

    if (!user.roles.includes(UserRole.INSTRUCTOR)) {
      user.roles.push(UserRole.INSTRUCTOR);
      await user.save();
    }

    return {
      user,
      instructorProfile,
    };
  },

  async rejectInstructorRequest(userId: string) {
    const user = await User.findById(userId)
      .populate<{
        instructorProfile: IInstructorProfileDocument;
      }>("instructorProfile")
      .lean();

    if (!user) {
      throw createHttpError(404, "User not found");
    }

    if (!user.instructorProfile) {
      throw createHttpError(400, "User has no instructor request");
    }

    const instructorProfile = user.instructorProfile;

    if (
      instructorProfile.verification.status === InstructorRequestStatus.REJECTED
    ) {
      throw createHttpError(400, "Instructor request already rejected");
    }

    instructorProfile.verification.status = InstructorRequestStatus.REJECTED;
    instructorProfile.verification.isVerified = false;

    await instructorProfile.save();

    if (user.roles.includes(UserRole.INSTRUCTOR)) {
      user.roles = user.roles.filter((role) => role !== UserRole.INSTRUCTOR);
      await user.save();
    }

    return {
      user,
      instructorProfile,
    };
  },
};
