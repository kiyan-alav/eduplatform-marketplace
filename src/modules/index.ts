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
import adminEnrollmentRouter from "./enrollment/admin/enrollment.admin.route";
import userEnrollmentRouter from "./enrollment/user/enrollment.user.route";
import lessonAdminRouter from "./lesson/admin/lesson.admin.route";
import lessonRouter from "./lesson/public/lesson.route";
import lessonUserRouter from "./lesson/user/lesson.user.route";
import notificationRouter from "./notification/notification.route";
import ratingAdminRouter from "./rating/admin/rating.admin.route";
import ratingRouter from "./rating/public/rating.route";
import ratingUserRouter from "./rating/user/rating.user.route";
import adminUserRouter from "./user/admin/user.admin.routes";
import userRouter from "./user/me/user.route";

const router = Router();

router.use("/auth", authRouter);

router.use("/user", userRouter);
router.use("/admin/user", adminUserRouter);

router.use("/user/notification", notificationRouter);

router.use("/category", categoryRouter);
router.use("/admin/category", categoryAdminRouter);

router.use("/lesson", lessonRouter);
router.use("/instructor/lesson", lessonUserRouter);
router.use("/admin/lesson", lessonAdminRouter);

router.use("/chapter", chapterRouter);
router.use("/instructor/chapter", chapterUserRouter);
router.use("/admin/chapter", adminChapterRouter);

router.use("/course", courseRouter);
router.use("/instructor/course", courseUserRouter);
router.use("/admin/course", courseAdminRouter);

router.use("/rating", ratingRouter);
router.use("/user/rating", ratingUserRouter);
router.use("/admin/rating", ratingAdminRouter);

router.use("/student/enrollment", userEnrollmentRouter);
router.use("/admin/enrollment", adminEnrollmentRouter);

export default router;
