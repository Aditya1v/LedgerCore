const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");
const ledgerModel = require("../models/legder.model");
const AppError = require("../utils/AppError");

async function createTransaction(data, user) {
  const { fromAccount, toAccount } = data;

  const fromUserAccount = await accountModel.findById(fromAccount);
  const toUserAccount = await accountModel.findById(toAccount);

  if (!fromUserAccount || !toUserAccount) {
    throw new Error("Sender or receiver account not found");
  }

  return {
    fromUserAccount,
    toUserAccount,
    data,
    user,
  };
}

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
    throw new AppError(
      "You are not authorized to view this transaction",
      403
    );
  }

  const ledgerEntries = await ledgerModel
    .find({
      transaction: transaction._id,
    })
    .populate("account", "name");

  const direction = transaction.toAccount.user.equals(user._id)
    ? "IN"
    : "OUT";

  return {
    ...transaction.toObject(),
    direction,
    ledgerEntries,
  };
}

module.exports = {
  createTransaction,
  getTransactionDetailsService,
};