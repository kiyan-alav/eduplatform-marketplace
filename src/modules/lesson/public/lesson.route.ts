import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { validateRequest } from "../../../middlewares/validateRequest";
import { LessonListQuerySchema } from "../lesson.filter";
import { lessonController } from "./lesson.controller";

const lessonRouter = Router();

lessonRouter.get(
  "/list",
  validateRequest(LessonListQuerySchema, "query"),
  lessonController.getAll,
);

lessonRouter.get(
  "/:id",
  validateRequest(paramsSchema, "params"),
  lessonController.getOne,
);

export default lessonRouter;
