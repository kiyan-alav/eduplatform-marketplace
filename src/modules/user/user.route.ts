import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware";
import { validateRequest } from "../../middlewares/validateRequest";
import { instructorDocumentUpload, userAvatarUpload } from "../../utils/multer";
import { userController } from "./user.controller";
import { updatePasswordSchema, updateProfileSchema } from "./user.validation";

const userRouter = Router();

userRouter.patch(
  "/profile",
  authGuard,
  userAvatarUpload.single("avatar"),
  validateRequest(updateProfileSchema, "body"),
  userController.profile,
);

userRouter.patch(
  "/change-password",
  authGuard,
  validateRequest(updatePasswordSchema, "body"),
  userController.changePassword,
);

userRouter.post(
  "/apply-to-instructor",
  authGuard,
  instructorDocumentUpload.array("documents"),
  userController.applyForInstructor,
);

export default userRouter;
