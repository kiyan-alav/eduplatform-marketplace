import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { UserRole } from "../../../generated/prisma/enums";
import { authGuard } from "../../../middlewares/auth.middleware";
import { roleGuard } from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { ChapterListQuerySchema } from "../chapter.filter";
import {
  createChapterSchema,
  updateChapterSchema,
} from "../chapter.validation";
import { chapterAdminController } from "./chapter.admin.controller";

const chapterAdminRouter = Router();

chapterAdminRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(ChapterListQuerySchema, "query"),
  chapterAdminController.getAll,
);

chapterAdminRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  chapterAdminController.getOne,
);

chapterAdminRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(createChapterSchema, "body"),
  chapterAdminController.create,
);

chapterAdminRouter.put(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateChapterSchema, "body"),
  chapterAdminController.edit,
);

chapterAdminRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.ADMIN]),
  validateRequest(paramsSchema, "params"),
  chapterAdminController.delete,
);

export default chapterAdminRouter;
