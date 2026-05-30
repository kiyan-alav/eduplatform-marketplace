import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { categoryController } from "./category.controller";
import { CategoryListQuerySchema } from "./category.filter";

const categoryRouter = Router();

categoryRouter.get(
  "/list",
  validateRequest(CategoryListQuerySchema, "query"),
  categoryController.getAll,
);

export default categoryRouter;
