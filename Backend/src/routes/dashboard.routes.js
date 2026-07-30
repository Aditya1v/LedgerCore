const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboard.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");
const asyncHandler = require("../utils/asyncHandler");


const router = express.Router();

router.get("/summary", authMiddleware, asyncHandler(getDashboardSummary));

module.exports = router;