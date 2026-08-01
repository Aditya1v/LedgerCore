const express = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const accountController = require('../controllers/account.controller')
const asyncHandler = require("../utils/asyncHandler");
const { createAccountSchema } = require("../validations/account.validation");
const validateRequest = require("../middlewares/validateRequest");

const router = express.Router()


/**
 * - POST /api/accounts/
 * - Create a new account
 * - Protected Route
 */
router.post("/",authMiddleware.authMiddleware , validateRequest(createAccountSchema),asyncHandler(accountController.createAccountController))

/**
 * - GET /api/accounts/
 * - Get all accounts of the logged-in user
 * - Protected Route
 */
router.get("/",authMiddleware.authMiddleware , asyncHandler(accountController.getUserAccountsController))

/**
 * - GET /api/accounts/balance/:accountId
 */
router.get("/balance/:accountId",authMiddleware.authMiddleware , asyncHandler(accountController.getAccountBalanceController))
 
module.exports = router