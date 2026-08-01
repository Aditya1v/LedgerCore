const {Router} = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const transactionController = require('../controllers/transaction.controller')
const transactionRoutes = Router();
const validateRequest = require("../middlewares/validateRequest");
const {createTransactionSchema} = require("../validations/transaction.validation");
const asyncHandler = require('../utils/asyncHandler');

/**
 * - GET /api/transactions
 * - Get all transactions of the logged-in user
 */
transactionRoutes.get(
  "/",
  authMiddleware.authMiddleware,
  asyncHandler(transactionController.getUserTransactions)
)

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post('/', authMiddleware.authMiddleware, validateRequest(createTransactionSchema), asyncHandler(transactionController.createTransaction))


/**
 * - POST /api/transactions/system/inital-funds
 * - Create initial funds transaction from system user
 */

transactionRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware,  asyncHandler(transactionController.createInitialFundsTransaction))

module.exports = transactionRoutes;