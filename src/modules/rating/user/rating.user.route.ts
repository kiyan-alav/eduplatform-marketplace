import { Router } from "express";
import { paramsSchema } from "../../../configs/jwt";
import { authGuard } from "../../../middlewares/auth.middleware";
import { validateRequest } from "../../../middlewares/validateRequest";
import { createRatingSchema } from "../rating.validation";
import { userRatingController } from "./rating.user.controller";

const ratingUserRouter = Router();

ratingUserRouter.post(
  "/create",
  authGuard,
  validateRequest(createRatingSchema, "body"),
  userRatingController.createRating,
);
ratingUserRouter.delete(
  "/:id/delete",
  authGuard,
  validateRequest(paramsSchema, "params"),
  userRatingController.deleteRating,
);

export default ratingUserRouter;
