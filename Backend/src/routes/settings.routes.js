const express = require("express");

const settingsController = require("../controllers/settings.controller");
const { authMiddleware } = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

/* GET /api/settings */
router.get(
  "/",
  authMiddleware,
  asyncHandler(settingsController.getSettingsController)
);

/* PUT /api/settings */
router.put(
  "/",
  authMiddleware,
  asyncHandler(settingsController.updateSettingsController)
);

module.exports = router;