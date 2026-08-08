const { Router } = require("express");

const asyncHandler = require("../utils/asyncHandler");
const demoController = require("../controllers/demo.controller");

const demoRoutes = Router();

demoRoutes.post(
  "/",
  asyncHandler(demoController.loginDemo)
);

module.exports = demoRoutes;