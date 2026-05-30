import { Router } from "express";
import authRouter from "./auth/auth.routes";
import categoryAdminRouter from "./category/category.admin.route";
import categoryRouter from "./category/category.route";
import adminUserRouter from "./user/user.admin.routes";
import userRouter from "./user/user.route";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);
router.use("/admin/user", adminUserRouter);

router.use("/category", categoryRouter);
router.use("/admin/category", categoryAdminRouter);

export default router;
