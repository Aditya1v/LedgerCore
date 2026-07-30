const accountModel = require("../models/account.model");

async function createTransaction(data, user) {
  const {
    fromAccount,
    toAccount,
  } = data;

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

module.exports = {
  createTransaction,
};