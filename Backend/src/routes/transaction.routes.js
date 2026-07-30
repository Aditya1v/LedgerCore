const {Router} = require('express')
const authMiddleware = require('../middlewares/auth.middleware')
const transactionController = require('../controllers/transaction.controller')
const transactionRoutes = Router();
const validateRequest = require("../middlewares/validateRequest");
const {createTransactionSchema} = require("../validations/transaction.validation");

/**
 * - POST /api/transactions/
 * - Create a new transaction
 */

transactionRoutes.post('/', authMiddleware.authMiddleware, validateRequest(createTransactionSchema), transactionController.createTransaction)


/**
 * - POST /api/transactions/system/inital-funds
 * - Create initial funds transaction from system user
 */

transactionRoutes.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware,  transactionController.createInitialFundsTransaction)

module.exports = transactionRoutes;