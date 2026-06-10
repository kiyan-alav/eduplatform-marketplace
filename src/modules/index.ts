import { Router } from "express";
import authRouter from "./auth/auth.routes";
import categoryAdminRouter from "./category/admin/category.admin.route";
import categoryRouter from "./category/public/category.route";
import adminChapterRouter from "./chapter/admin/chapter.admin.route";
import chapterRouter from "./chapter/public/chapter.route";
import chapterUserRouter from "./chapter/user/chapter.user.route";
import courseAdminRouter from "./course/admin/course.admin.route";
import courseRouter from "./course/public/course.route";
import courseUserRouter from "./course/user/course.user.route";
import ratingRouter from "./rating/public/rating.route";
import adminUserRouter from "./user/admin/user.admin.routes";
import userRouter from "./user/me/user.route";
import ratingUserRouter from "./rating/user/rating.user.route";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);
router.use("/admin/user", adminUserRouter);

router.use("/category", categoryRouter);
router.use("/admin/category", categoryAdminRouter);

router.use("/chapter", chapterRouter);
router.use("/chapter/instructor", chapterUserRouter);
router.use("/admin/chapter", adminChapterRouter);

router.use("/course", courseRouter);
router.use("/course/instructor", courseUserRouter);
router.use("/admin/course", courseAdminRouter);

router.use("/rating", ratingRouter);
router.use("/rating/user", ratingUserRouter);

export default router;
