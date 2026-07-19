import { Router } from "express";
import { z } from "zod";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validateRequest";
import { EnrollmentListQuerySchema } from "../enrollment.filter";
import { enrollmentAdminController } from "./enrollment.admin.controller";

const enrollmentParamsSchema = z.object({
  studentId: z.coerce.number().int().positive(),
  courseId: z.coerce.number().int().positive(),
});

const adminEnrollmentRouter = Router();

adminEnrollmentRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(EnrollmentListQuerySchema, "query"),
  enrollmentAdminController.getAll,
);

adminEnrollmentRouter.get(
  "/:studentId/:courseId",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(enrollmentParamsSchema, "params"),
  enrollmentAdminController.getOne,
);

export default adminEnrollmentRouter;
