import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { validateRequest } from "../../../middlewares/validateRequest";
import { ChapterListQuerySchema } from "../chapter.filter";
import { chapterController } from "./chapter.controller";

const chapterRouter = Router();

chapterRouter.get(
  "/list",
  validateRequest(ChapterListQuerySchema, "query"),
  chapterController.getAll,
);

chapterRouter.get(
  "/:id",
  validateRequest(paramsSchema, "params"),
  chapterController.getOne,
);

export default chapterRouter;
