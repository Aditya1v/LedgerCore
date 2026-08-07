const { Router } = require("express");
const {
  authMiddleware,
  authSystemUserMiddleware,
} = require("../middlewares/auth.middleware");

const transactionController = require("../controllers/transaction.controller");
const validateRequest = require("../middlewares/validateRequest");
const {
  createTransactionSchema,
} = require("../validations/transaction.validation");
const asyncHandler = require("../utils/asyncHandler");

const transactionRoutes = Router();

/**
 * GET /api/transactions
 */
transactionRoutes.get(
  "/",
  authMiddleware,
  asyncHandler(transactionController.getUserTransactions)
);

/**
 * GET /api/transactions/:id
 */
transactionRoutes.get(
  "/:id",
  authMiddleware,
  asyncHandler(transactionController.getTransactionDetails)
);

/**
 * POST /api/transactions
 */
transactionRoutes.post(
  "/",
  authMiddleware,
  validateRequest(createTransactionSchema),
  asyncHandler(transactionController.createTransaction)
);

/**
 * POST /api/transactions/system/initial-funds
 */
transactionRoutes.post(
  "/system/initial-funds",
  authSystemUserMiddleware,
  asyncHandler(transactionController.createInitialFundsTransaction)
);

module.exports = transactionRoutes;