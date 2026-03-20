import { Router } from "express"
import { registerValidator, loginValidator } from "../validators/auth.validator.js"
import { loginController, registerController, getMeController, verifyEmailController, resendVerificationEmailController, resetPasswordLinkController, resetPasswordController, logoutController } from "../controllers/auth.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.post("/register", registerValidator, registerController)
router.post("/login", loginValidator, loginController)
router.get("/logout", authMiddleware, logoutController)
router.post("/reset-password-link", resetPasswordLinkController)
router.post("/reset-password", resetPasswordController)
router.get("/me", authMiddleware, getMeController)
router.get("/verify-email", verifyEmailController)
router.post("/resend-verification-email", resendVerificationEmailController)

export default router
