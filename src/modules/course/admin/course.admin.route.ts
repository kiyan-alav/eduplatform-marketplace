import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { coursesCoverUpload } from "../../../utils/multer";
import { UserRole } from "../../user/user.types";
import { CourseListQuerySchema } from "../course.filter";
import {
  createAdminCourseSchema,
  updateAdminCourseSchema,
} from "../course.validation";
import { courseAdminController } from "./course.admin.controller";

const courseAdminRouter = Router();

courseAdminRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(CourseListQuerySchema, "query"),
  courseAdminController.getAll,
);

courseAdminRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  courseAdminController.getOne,
);

courseAdminRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  coursesCoverUpload.single("avatar"),
  validateRequest(createAdminCourseSchema, "body"),
  courseAdminController.create,
);

courseAdminRouter.put(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateAdminCourseSchema, "body"),
  courseAdminController.edit,
);

courseAdminRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  courseAdminController.delete,
);

export default courseAdminRouter;
