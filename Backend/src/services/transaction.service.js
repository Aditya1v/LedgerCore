const mongoose = require("mongoose");

//Models
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/ledger.model");

const AppError = require("../utils/AppError");

async function getTransactionDetailsService(transactionId, user) {
  const transaction = await transactionModel
    .findById(transactionId)
    .populate("fromAccount", "name currency user")
    .populate("toAccount", "name currency user");

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  const isOwner =
    transaction.fromAccount.user.equals(user._id) ||
    transaction.toAccount.user.equals(user._id);

  if (!isOwner) {
    throw new AppError("You are not authorized to view this transaction", 403);
  }

  const ledgerEntries = await ledgerModel
    .find({
      transaction: transaction._id,
    })
    .populate("account", "name");

  const direction = transaction.toAccount.user.equals(user._id) ? "IN" : "OUT";

  return {
    ...transaction.toObject(),
    direction,
    ledgerEntries,
  };
}

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
 * 10. Send email notifications to both sender and receiver ( check controller)
 */

async function performTransfer(data, options = {}) {
  const { skipBalanceCheck = false, transactionDate = null,} = options;
  /**
   * 1. Validate the request body to ensure that all required fields are present and valid.
   */
  const {
    fromAccount,
    toAccount,
    amount,
    category,
    transactionType,
    merchant,
    description,
    tags,
    idempotencyKey,
  } = data;
  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    throw new AppError("Sender or receiver account not found", 400);
  }

  /**
   * 2. Validate the idempotency key to ensure that it is unique and has not been used before.
   */
  const isTransactionAlreadyExists = await transactionModel.findOne({
    idempotencyKey,
  });

  if (isTransactionAlreadyExists) {
    if (isTransactionAlreadyExists) {
      if (isTransactionAlreadyExists.status === "COMPLETED") {
        throw new AppError("Transaction already completed", 409);
      }

      if (isTransactionAlreadyExists.status === "PENDING") {
        throw new AppError("Transaction is still pending", 409);
      }

      if (isTransactionAlreadyExists.status === "FAILED") {
        throw new AppError("Transaction failed, please try again", 400);
      }

      if (isTransactionAlreadyExists.status === "REVERSED") {
        throw new AppError("Transaction was reversed, please try again", 400);
      }
    }
  }
  /**
   * 3. Check account status
   */

  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    throw new AppError("Sender or receiver account is not active", 400);
  }

  /**
   * 4. Derive sender balance from ledger
   */
  if(!skipBalanceCheck){
    const balance = await fromUserAccount.getBalance();

    if (balance < amount) {
      throw new AppError(
        `Insufficient balance in sender account. Current balance is ${balance} and transaction amount is ${amount}`,
        400,
      );
    }
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
            transactionType,
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

    const debitLedger = (
    await ledgerModel.create(
      [
        {
          account: fromAccount,
          transaction: transaction._id,
          type: "DEBIT",
          amount,
        },
      ],
      { session }
    )
  )[0];

    //delaying the credit ledger entry to simulate a long-running transaction
    // await new Promise((resolve) => setTimeout(resolve, 15000));

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


  if (transactionDate) {
    await transactionModel.updateOne(
      { _id: transaction._id },
      {
        $set: {
          createdAt: transactionDate,
          updatedAt: transactionDate,
        },
      },
      {
        timestamps: false,
      }
    );

    transaction.createdAt = transactionDate;
    transaction.updatedAt = transactionDate;
  }


  return {
    transaction,
  };
}
module.exports = {
  performTransfer,
  getTransactionDetailsService,
};
