import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { RatingListQuerySchema } from "../rating.filter";
import { ratingController } from "./rating.controller";

const ratingRouter = Router();

ratingRouter.get(
  "/list",
  validateRequest(RatingListQuerySchema, "query"),
  ratingController.getAll,
);

export default ratingRouter;
