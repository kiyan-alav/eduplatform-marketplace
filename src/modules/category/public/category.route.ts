import { Router } from "express";
import { CategoryListQuerySchema } from "../category.filter";
import { validateRequest } from "../../../middlewares/validateRequest";
import { categoryController } from "./category.controller";

const categoryRouter = Router();

categoryRouter.get(
  "/list",
  validateRequest(CategoryListQuerySchema, "query"),
  categoryController.getAll,
);

export default categoryRouter;
