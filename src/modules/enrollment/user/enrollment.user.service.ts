import createHttpError from "http-errors";
import { buildQueryFilters } from "../../../utils/query-builder";
import { Course } from "../../course/course.model";
import { StudentProfile } from "../../user/profiles/student/student.model";
import { enrollmentFilterConfig } from "../enrollment.filter";
import { Enrollment } from "../enrollment.model";
import {
  ICreateEnrollmentRequest,
  IEnrollmentFilter,
} from "../enrollment.types";

export const enrollmentUserService = {
  async getAll(userId: string, filter: IEnrollmentFilter) {
    const student = await StudentProfile.findOne({ user: userId });

    if (!student) {
      throw createHttpError(404, "Student profile not found");
    }

    const { options, mongoFilter } = buildQueryFilters(
      filter,
      enrollmentFilterConfig,
    );

    mongoFilter.student = student._id;

    options.populate = [{ path: "course", select: "title" }];

    const result = await Enrollment.paginate(mongoFilter, options);

    return result;
  },

  async getOne(userId: string, id: string) {
    const student = await StudentProfile.findOne({ user: userId });

    if (!student) {
      throw createHttpError(404, "Student profile not found");
    }

    const enrollment = await Enrollment.findOne({
      _id: id,
      student: student._id,
    }).populate([{ path: "course", select: "-createdAt -updatedAt -__v" }]);

    if (!enrollment) {
      throw createHttpError(404, "Enrollment not found");
    }

    return enrollment;
  },

  async create(userId: string, data: ICreateEnrollmentRequest) {
    const course = await Course.findById(data.course);
    const student = await StudentProfile.findOne({ user: userId });

    if (!course) {
      throw createHttpError(404, "Course not found");
    }
    if (!student) {
      throw createHttpError(404, "Student profile not found");
    }

    const alreadyEnrolled = await Enrollment.findOne({
      student: student._id,
      course: course._id,
    });

    if (alreadyEnrolled) {
      throw createHttpError(409, "You are already enrolled in this course");
    }

    const enrollment = new Enrollment({
      student: student._id,
      course: data.course,
      paid: data.paid,
      paidAt: data.paidAt,
    });
    await enrollment.save();
    return enrollment;
  },
};
