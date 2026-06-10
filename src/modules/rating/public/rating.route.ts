import { Router } from "express";
import { ratingController } from "./rating.controller";

const ratingRouter = Router();

ratingRouter.get("/:id/list", ratingController.getAll);

export default ratingRouter;
