import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../../user/user.types";
import { RatingListQuerySchema } from "../rating.filter";
import { ratingAdminController } from "./rating.admin.controller";

const ratingAdminRouter = Router();

ratingAdminRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(RatingListQuerySchema, "query"),
  ratingAdminController.getAll,
);

ratingAdminRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  ratingAdminController.delete,
);

ratingAdminRouter.patch(
  "/:id/toggle-visibility",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  ratingAdminController.toggleVisibility,
);

export default ratingAdminRouter;
