import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { validateRequest } from "../../../middlewares/validateRequest";
import { CourseListQuerySchema } from "../course.filter";
import { courseController } from "./course.controller";

const courseRouter = Router();

courseRouter.get(
  "/list",
  validateRequest(CourseListQuerySchema, "query"),
  courseController.getAll,
);

courseRouter.get(
  "/:id",
  validateRequest(paramsSchema, "params"),
  courseController.getOne,
);

export default courseRouter;
