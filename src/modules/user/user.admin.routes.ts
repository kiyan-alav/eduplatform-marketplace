import { Router } from "express";
import { paramsSchema } from "../../configs/jwt";
import { authGuard } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.middlreware";
import { validateRequest } from "../../middlewares/validateRequest";
import { adminUserController } from "./user.admin.controller";
import {
  InstructorRequestQuerySchema,
  UserListQuerySchema,
} from "./user.filter";
import { UserRole } from "./user.types";

const adminUserRouter = Router();

adminUserRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(UserListQuerySchema, "query"),
  adminUserController.users,
);

adminUserRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  adminUserController.singleUser,
);

adminUserRouter.get(
  "/instructor/request/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(InstructorRequestQuerySchema, "query"),
  adminUserController.instructorRequests,
);

adminUserRouter.patch(
  "/instructor/request/:id/apply",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  adminUserController.applyRequests,
);

adminUserRouter.patch(
  "/instructor/request/:id/reject",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  adminUserController.rejectRequests,
);

export default adminUserRouter;
