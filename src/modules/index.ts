import { Router } from "express";
import authRouter from "./auth/auth.routes";
import categoryAdminRouter from "./category/admin/category.admin.route";
import categoryRouter from "./category/public/category.route";
import adminUserRouter from "./user/admin/user.admin.routes";
import userRouter from "./user/me/user.route";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);
router.use("/admin/user", adminUserRouter);

router.use("/category", categoryRouter);
router.use("/admin/category", categoryAdminRouter);

export default router;
