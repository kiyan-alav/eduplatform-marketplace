import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.middlreware";
import { adminUserController } from "./user.admin.controller";
import { UserRole } from "./user.types";

const adminUserRouter = Router();

adminUserRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  adminUserController.users,
);

adminUserRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  adminUserController.singleUser,
);

adminUserRouter.get(
  "/instructor/request/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  adminUserController.instructorRequests,
);

adminUserRouter.patch(
  "/instructor/request/:id/apply",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  adminUserController.applyRequests,
);

adminUserRouter.patch(
  "/instructor/request/:id/reject",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  adminUserController.rejectRequests,
);

export default adminUserRouter