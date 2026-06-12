import createHttpError from "http-errors";
import { Types } from "mongoose";
import { buildQueryFilters } from "../../../utils/query-builder";
import { Chapter } from "../../chapter/chapter.model";
import { Lesson } from "../../lesson/lesson.model";
import { notificationService } from "../../notification/notification.service";
import { NotificationType } from "../../notification/notification.types";
import { InstructorProfile } from "../../user/profiles/instructor/instructor.model";
import { courseFilterConfig } from "../course.filter";
import { Course } from "../course.model";
import {
  ICourseFilter,
  ICreateCourseRequest,
  IUpdateCourseRequest,
} from "../course.types";

export const courseUserService = {
  async getAll(filters: ICourseFilter, userId?: string) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      courseFilterConfig,
    );

    if (userId) {
      const instructor = await InstructorProfile.findOne({
        user: userId,
      }).select("_id");

      if (!instructor) {
        throw createHttpError(404, "Instructor not found!");
      }

      mongoFilter.instructor = instructor._id;
    }

    options.populate = [
      { path: "category", select: "name" },
      {
        path: "instructor",
        select: "verification.isVerified verification.status _id",
        populate: {
          path: "user",
          select: "fullName email phone _id avatar",
        },
      },
    ];

    const result = await Course.paginate(mongoFilter, options);

    return result;
  },

  async getOne(id: string, userId?: string) {
    const course = await Course.findById(id).populate([
      { path: "category", select: "-createdAt -updatedAt -__v" },
      {
        path: "instructor",
        select: "-createdAt -updatedAt -__v",
        populate: {
          path: "user",
          select: "-createdAt -updatedAt -__v",
        },
      },
    ]);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    if (userId) {
      const instructor = await InstructorProfile.findOne({
        user: userId,
      }).select("_id");

      if (!instructor) {
        throw createHttpError(
          403,
          "You are not authorized to access this course!",
        );
      }

      if (course.instructor._id.toString() !== instructor._id.toString()) {
        throw createHttpError(
          403,
          "You are not authorized to access this course!",
        );
      }
    }

    return course;
  },

  async create(data: ICreateCourseRequest, cover?: string) {
    const title = data.title.trim();
    const description = data.description?.trim();

    const instructorProfile = await InstructorProfile.findOne({
      user: data.instructor,
    }).select("_id");

    if (!instructorProfile) {
      throw createHttpError(
        403,
        "You are not authorized to create courses. You must be an instructor.",
      );
    }

    const instructorId = instructorProfile._id;

    const categoryId = new Types.ObjectId(data.category);

    if (data.instructor) {
      const otherInstructorProfile = await InstructorProfile.findOne({
        user: data.instructor,
      }).select("_id");
      if (!otherInstructorProfile) {
        throw createHttpError(
          400,
          "Instructor not found for the specified user.",
        );
      }
      throw createHttpError(403, "You can only create courses for yourself.");
    }

    await notificationService.create({
      user: instructorId.toString(),
      title: "Your course has been created",
      description:
        "After review, your course will be published and available for students.",
      type: NotificationType.SUCCESS,
    });

    return await Course.create({
      title,
      description,
      instructor: instructorId,
      price: data.price,
      level: data.level,
      category: categoryId,
      cover: cover || null,
    });
  },

  async edit(id: string, data: IUpdateCourseRequest, cover?: string) {
    const course = await Course.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    if (typeof data.title === "string") course.title = data.title.trim();

    if (typeof data.description === "string")
      course.description = data.description.trim();

    if (typeof data.category === "string") {
      if (!Types.ObjectId.isValid(data.category)) {
        throw createHttpError(400, "Invalid category id");
      }
      course.category = new Types.ObjectId(data.category);
    }

    if (data.price !== undefined) course.price = data.price;

    if (data.level) course.level = data.level;

    if (typeof cover === "string") course.cover = cover;

    await course.save();

    return course;
  },

  async delete(id: string) {
    const course = await Course.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    const chapters = await Chapter.find({ course: course._id })
      .select("_id")
      .lean();
    const chapterIds = chapters.map((chapter) => chapter._id);

    if (chapterIds.length > 0) {
      await Lesson.deleteMany({ chapter: { $in: chapterIds } });
    }

    await Chapter.deleteMany({ course: course._id });
    await course.deleteOne();

    return course;
  },
};
