import { Router } from "express";
import authRouter from "./auth/auth.routes";
import userRouter from "./user/user.route";
import adminUserRouter from "./user/user.admin.routes";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);
router.use("/admin/user", adminUserRouter);

export default router;
