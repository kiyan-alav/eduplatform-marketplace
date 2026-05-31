import { Router } from "express";
import { adminUserController } from "./user.admin.controller";
import { authGuard } from "../../../middlewares/auth.middleware";
import { UserRole } from "../user.types";
import { InstructorRequestQuerySchema, UserListQuerySchema } from "../user.filter";
import { validateRequest } from "../../../middlewares/validateRequest";
import { roleGuard } from "../../../middlewares/role.middlreware";
import { paramsSchema } from "../../../configs/jwt";


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
