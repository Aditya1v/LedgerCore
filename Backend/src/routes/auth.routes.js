const express = require("express");
const authController = require("../controllers/auth.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/* POST /api/auth/register */
router.post("/register", asyncHandler(authController.userRegisterController));

/* POST /api/auth/login */
router.post("/login", asyncHandler(authController.userLoginController));

/* GET /api/auth/me */
router.get(
  "/me",
  authMiddleware,
  asyncHandler(authController.currentUserController)
);

/* PUT /api/auth/profile */
router.put(
  "/profile",
  authMiddleware,
  asyncHandler(authController.updateProfileController)
);

/* PUT /api/auth/change-password */
router.put(
  "/change-password",
  authMiddleware,
  asyncHandler(authController.changePasswordController)
);

/* POST /api/auth/logout */
router.post("/logout", asyncHandler(authController.userLogoutController));

module.exports = router;