import { Router } from "express";
import { validateRequest } from "../../../middlewares/validateRequest";
import { CategoryListQuerySchema } from "../category.filter";
import { categoryController } from "./category.controller";

const categoryRouter = Router();

categoryRouter.get(
  "/list",
  validateRequest(CategoryListQuerySchema, "query"),
  categoryController.getAll,
);

export default categoryRouter;
