import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import {
  isVerifiedInstructor,
  roleGuard,
} from "../../../middlewares/role.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { UserRole } from "../../user/user.types";
import { ChapterListQuerySchema } from "../chapter.filter";
import {
  createChapterSchema,
  updateChapterSchema,
} from "../chapter.validation";
import { chapterUserController } from "./chapter.user.controller";

const chapterUserRouter = Router();

chapterUserRouter.get(
  "/list",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(ChapterListQuerySchema, "query"),
  chapterUserController.getAll,
);

chapterUserRouter.get(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  chapterUserController.getOne,
);

chapterUserRouter.post(
  "/",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(createChapterSchema, "body"),
  chapterUserController.create,
);

chapterUserRouter.put(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  validateRequest(updateChapterSchema, "body"),
  chapterUserController.edit,
);

chapterUserRouter.delete(
  "/:id",
  authGuard,
  roleGuard([UserRole.INSTRUCTOR], isVerifiedInstructor),
  validateRequest(paramsSchema, "params"),
  chapterUserController.delete,
);

export default chapterUserRouter;
