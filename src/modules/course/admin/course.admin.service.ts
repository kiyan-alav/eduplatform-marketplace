import createHttpError from "http-errors";
import { Types } from "mongoose";
import { buildQueryFilters } from "../../../utils/query-builder";
import { Chapter } from "../../chapter/chapter.model";
import { Lesson } from "../../lesson/lesson.model";
import { courseFilterConfig } from "../course.filter";
import { Course } from "../course.model";
import {
  ICourseFilter,
  ICreateCourseRequest,
  IUpdateCourseRequest,
} from "../course.types";

export const courseAdminService = {
  async getAll(filters: ICourseFilter) {
    const { mongoFilter, options } = buildQueryFilters(
      filters,
      courseFilterConfig,
    );

    const result = await Course.paginate(mongoFilter, options);

    return result;
  },

  async getOne(id: string) {
    const course = await Course.findById(id);

    if (!course) {
      throw createHttpError(404, "Course not found!");
    }

    return course;
  },

  async create(data: ICreateCourseRequest) {
    const title = data.title.trim();
    const description = data.description.trim();

    const instructorId = new Types.ObjectId(data.instructor);
    const categoryId = new Types.ObjectId(data.category);

    return await Course.create({
      title,
      description,
      instructor: instructorId,
      price: data.price,
      level: data.level,
      category: categoryId,
    });
  },

  async edit(id: string, data: IUpdateCourseRequest) {
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

    if (typeof data.instructor === "string") {
      if (!Types.ObjectId.isValid(data.instructor)) {
        throw createHttpError(400, "Invalid instructor id");
      }
      course.instructor = new Types.ObjectId(data.instructor);
    }

    if (data.price !== undefined) course.price = data.price;

    if (data.level) course.level = data.level;

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
