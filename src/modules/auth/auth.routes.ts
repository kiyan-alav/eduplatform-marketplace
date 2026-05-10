import { Router } from "express";
import { validateRequest } from "../../middlewares/validateRequest";
import { userAvatarUpload } from "../../utils/multer";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

const authRouter = Router();

authRouter.post(
  "/register",
  userAvatarUpload.single("avatar"),
  validateRequest(registerSchema, "body"),
  authController.register,
);

authRouter.post(
  "/login",
  validateRequest(loginSchema, "body"),
  authController.login,
);

export default authRouter;
