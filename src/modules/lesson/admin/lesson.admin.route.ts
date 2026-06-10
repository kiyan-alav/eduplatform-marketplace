import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../../user/user.types";
import { LessonListQuerySchema } from "../leeson.filter";
import { createLessonSchema, updateLessonSchema } from "../leeson.validation";
import { lessonAdminController } from "./lesson.admin.controller";

const lessonAdminRouter = Router();

lessonAdminRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(LessonListQuerySchema, "query"),
  lessonAdminController.getAll,
);

lessonAdminRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  lessonAdminController.getOne,
);

lessonAdminRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(createLessonSchema, "body"),
  lessonAdminController.create,
);

lessonAdminRouter.put(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateLessonSchema, "body"),
  lessonAdminController.edit,
);

lessonAdminRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  lessonAdminController.delete,
);

export default lessonAdminRouter;
