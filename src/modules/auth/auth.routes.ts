import { Router } from "express";
import { authGuard } from "../../middlewares/auth.middleware";
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

authRouter.get("/me", authGuard, authController.getMe);

authRouter.post("/refresh", authGuard, authController.refreshToken);

export default authRouter;
