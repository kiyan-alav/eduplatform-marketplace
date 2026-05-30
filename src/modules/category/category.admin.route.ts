import { Router } from "express";
import { paramsSchema } from "../../configs/jwt";
import { authGuard } from "../../middlewares/auth.middleware";
import { roleGuard } from "../../middlewares/role.middlreware";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserRole } from "../user/user.types";
import { categoryAdminController } from "./category.admin.controller";
import { CategoryListQuerySchema } from "./category.filter";
import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation";

const categoryAdminRouter = Router();

categoryAdminRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(CategoryListQuerySchema, "query"),
  categoryAdminController.getAll,
);

categoryAdminRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(createCategorySchema, "body"),
  categoryAdminController.create,
);

categoryAdminRouter.patch(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateCategorySchema, "body"),
  categoryAdminController.update,
);

categoryAdminRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  categoryAdminController.delete,
);

export default categoryAdminRouter;
