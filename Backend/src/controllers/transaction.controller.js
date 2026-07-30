const mongoose = require("mongoose");

// Models
const accountModel = require("../models/account.model");
const ledgerModel = require("../models/legder.model");
const transactionModel = require("../models/transaction.model");

// Services
const emailService = require("../services/email.service");
const transactionService = require("../services/transaction.service");

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate the request body to ensure that all required fields are present and valid.
 * 2. Validate the idempotency key to ensure that it is unique and has not been used before.
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry for sender account
 * 7. Create CREDIT ledger entry for receiver account
 * 8. Mark transaction as COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notifications to both sender and receiver
 */

async function createTransaction(req, res) {
  /**
   * 1. Validate the request body to ensure that all required fields are present and valid.
   */
  const {
    fromAccount,
    toAccount,
    amount,
    category,
    merchant,
    description,
    tags,
    idempotencyKey,
  } = req.body;

  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    return res.status(400).json({
      success: false,
      message: "Sender or receiver account not found",
    });
  }

  /**
   * 2. Validate the idempotency key to ensure that it is unique and has not been used before.
   */

  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists.status === "COMPLETED") {
      return res.status(200).json({
        success: true,
        message: "Transaction already completed",
        transaction: isTransactionAlreadyExists,
      });
    }

    if (isTransactionAlreadyExists.status === "PENDING") {
      return res.status(200).json({
        success: true,
        message: "Transaction is still pending",
      });
    }

    if (isTransactionAlreadyExists.status === "FAILED") {
      return res.status(500).json({
        success: false,
        message: "Transaction failed, please try again",
      });
    }

    if (isTransactionAlreadyExists.status === "REVERSED") {
      return res.status(500).json({
        success: false,
        message: "Transaction was reversed, please try again",
      });
    }
  }

  /**
   * 3. Check account status
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      success: false,
      message: "Sender or receiver account is not active",
    });
  }

  /**
   * 4. Derive sender balance from ledger
   */

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
    return res.status(400).json({
      success: false,
      message: `Insufficient balance in sender account. Current balance is ${balance} and transaction amount is ${amount}`,
    });
  }

  /**
   * 5. Create transaction (PENDING)
   */

  let transaction;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    transaction = (
      await transactionModel.create(
        [
          {
            fromAccount,
            toAccount,
            amount,
            transactionType: "TRANSFER",
            category,
            merchant,
            description,
            tags,
            idempotencyKey,
            status: "PENDING",
          },
        ],
        { session },
      )
    )[0];

    /**
     * 6. Create DEBIT ledger entry for sender account
     */

    await ledgerModel.create(
      [
        {
          account: fromAccount,
          transaction: transaction._id,
          type: "DEBIT",
          amount,
        },
      ],
      { session },
    );

    //delaying the credit ledger entry to simulate a long-running transaction
    await new Promise((resolve) => setTimeout(resolve, 15000));

    /**
     * 7. Create CREDIT ledger entry for receiver account
     */

    await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          type: "CREDIT",
          amount,
        },
      ],
      { session },
    );

    /**
     * 8. Mark transaction as COMPLETED
     */

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    /**
     * 9. Commit MongoDB session
     */

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
   session.endSession();
  }

  /**
   * 10. Send email notifications to both sender and receiver
   */

  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  );

  return res.status(201).json({
    success: true,
    message: "Transaction completed successfully",
    transaction,
  });
  
}

async function createInitialFundsTransaction(req, res) {
  const { toAccount, amount, idempotencyKey } = req.body;

  const toUserAccount = await accountModel.findById(toAccount);

  if (!toUserAccount) {
    return res.status(400).json({
      success: false,
      message: "Receiver account not found",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    user: req.user._id,
  });

  if (!fromUserAccount) {
    return res.status(400).json({
      success: false,
      message: "System user account not found",
    });
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const transaction = new transactionModel({
      fromAccount: fromUserAccount._id,
      toAccount,
      amount,

      transactionType: "DEPOSIT",
      category: "Initial Funding",
      description: "Initial account funding",

      idempotencyKey,
      status: "PENDING",
    });

    await ledgerModel.create(
      [
        {
          account: fromUserAccount._id,
          transaction: transaction._id,
          type: "DEBIT",
          amount,
        },
      ],
      { session },
    );

    await ledgerModel.create(
      [
        {
          account: toAccount,
          transaction: transaction._id,
          type: "CREDIT",
          amount,
        },
      ],
      { session },
    );

    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Initial funds transaction completed successfully",
      transaction,
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
   session.endSession();
  }
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
};
