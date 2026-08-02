const { Router } = require("express");

const authMiddleware = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");
const analyticsController = require("../controllers/analytics.controller");

const analyticsRoutes = Router();

analyticsRoutes.get(
  "/",
  authMiddleware.authMiddleware,
  asyncHandler(analyticsController.getAnalyticsController)
);

module.exports = analyticsRoutes;