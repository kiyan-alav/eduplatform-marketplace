import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import {
  isVerifiedInstructor,
  roleGuard,
} from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { coursesCoverUpload } from "../../../utils/multer";
import { UserRole } from "../../user/user.types";
import { CourseListQuerySchema } from "../course.filter";
import {
  createInstructorCourseSchema,
  updateInstructorCourseSchema,
} from "../course.validation";
import { courseUserController } from "./course.user.controller";

const courseUserRouter = Router();

courseUserRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(CourseListQuerySchema, "query"),
  courseUserController.getAll,
);

courseUserRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  courseUserController.getOne,
);

courseUserRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  coursesCoverUpload.single("cover"),
  validateRequest(createInstructorCourseSchema, "body"),
  courseUserController.create,
);

courseUserRouter.put(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  coursesCoverUpload.single("cover"),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateInstructorCourseSchema, "body"),
  courseUserController.edit,
);

courseUserRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  courseUserController.delete,
);
