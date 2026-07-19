import { Router } from "express";
import { z } from "zod";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { EnrollmentListQuerySchema } from "../enrollment.filter";
import { createEnrollmentSchema } from "../enrollment.validation";
import { enrollmentUserController } from "./enrollment.user.controller";

const enrollmentParamsSchema = z.object({
  courseId: z.coerce.number().int().positive(),
});

const userEnrollmentRouter = Router();

userEnrollmentRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.STUDENT]),
  validateRequest(EnrollmentListQuerySchema, "query"),
  enrollmentUserController.getAll,
);

userEnrollmentRouter.get(
  "/:courseId",
  authGuard,
  roleGuard([UserRole.STUDENT]),
  validateRequest(enrollmentParamsSchema, "params"),
  enrollmentUserController.getOne,
);

userEnrollmentRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.STUDENT]),
  validateRequest(createEnrollmentSchema, "body"),
  enrollmentUserController.create,
);

export default userEnrollmentRouter;
