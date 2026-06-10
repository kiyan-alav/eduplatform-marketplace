import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import {
  isVerifiedInstructor,
  roleGuard,
} from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../../user/user.types";
import { LessonListQuerySchema } from "../leeson.filter";
import { lessonUserController } from "./lesson.user.controller";
import { createLessonSchema, updateLessonSchema } from "../leeson.validation";

const lessonUserRouter = Router();

lessonUserRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(LessonListQuerySchema, "query"),
  lessonUserController.getAll,
);

lessonUserRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  lessonUserController.getOne,
);

lessonUserRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(createLessonSchema, "body"),
  lessonUserController.create,
);

lessonUserRouter.put(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateLessonSchema, "body"),
  lessonUserController.edit,
);

lessonUserRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  lessonUserController.delete,
);

export default lessonUserRouter;
