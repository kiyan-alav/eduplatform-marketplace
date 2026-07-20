import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { UserRole } from "../../../generated/prisma/enums";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
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

ratingAdminRouter.patch(
  "/:id/toggle-visibility",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  ratingAdminController.toggleVisibility,
);

ratingAdminRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  ratingAdminController.delete,
);

export default ratingAdminRouter;
