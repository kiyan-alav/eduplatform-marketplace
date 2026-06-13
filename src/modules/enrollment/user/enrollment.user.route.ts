import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../../user/user.types";
import { EnrollmentListQuerySchema } from "../enrollment.filter";
import { createEnrollmentSchema } from "../enrollment.validation";
import { enrollmentUserController } from "./enrollment.user.controller";

const userEnrollmentRouter = Router();

userEnrollmentRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.STUDENT]),
  validateRequest(EnrollmentListQuerySchema, "query"),
  enrollmentUserController.getAll,
);

userEnrollmentRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.STUDENT]),
  validateRequest(paramsSchema, "params"),
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
