import { Router } from "express";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { UserRole } from "../../user/user.types";
import { validateRequest } from "../../../middlewares/validateRequest";
import { EnrollmentListQuerySchema } from "../enrollment.filter";
import { enrollmentAdminController } from "./enrollment.admin.controller";
import { paramsSchema } from "../../../configs/jwt";

const adminEnrollmentRouter = Router();

adminEnrollmentRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(EnrollmentListQuerySchema, "query"),
  enrollmentAdminController.getAll,
);

adminEnrollmentRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  enrollmentAdminController.getOne,
);

export default adminEnrollmentRouter;
