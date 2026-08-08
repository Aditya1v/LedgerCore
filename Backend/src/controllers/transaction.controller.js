
// Utils
const AppError = require("../utils/AppError");
const sendResponse = require("../utils/sendResponse");

// Models
const accountModel = require('../models/account.model')
const transactionModel = require("../models/transaction.model");


// Services
const emailService = require("../services/email.service");
const transactionService = require("../services/transaction.service");



async function createTransaction(req, res) {


  // Execute transfer
  
 const transaction = await transactionService.performTransfer({
  ...req.body , 
  transactionType: "TRANSFER"
});

  /**
   * 10. Send email notifications to both sender and receiver
   */

  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    req.body.amount,
    req.body.toAccount
  );

  return sendResponse(
    res,
    201,
    "Transaction completed successfully",
    transaction,
  );
}

async function createInitialFundsTransaction(req, res) {

    const { toAccount, amount, idempotencyKey } = req.body;

    const toUserAccount = await accountModel.findById(toAccount);

    if (!toUserAccount) {
        throw new AppError("Receiver account not found",400);
    }

    const fromUserAccount = await accountModel.findOne({
        user:req.user._id
    });

    if(!fromUserAccount){
        throw new AppError("System user account not found",400);
    }

    const transaction =
        await transactionService.performTransfer({

            fromAccount:fromUserAccount._id,

            toAccount,

            amount,

            transactionType:"DEPOSIT",

            category:"Initial Funding",

            merchant:"LedgerCore",

            description:"Initial account funding",

            tags:[],

            idempotencyKey
        });

    return sendResponse(
        res,
        201,
        "Transaction completed successfully",
        transaction
    );
}

async function getUserTransactions(req, res) {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const direction = req.query.direction || "";
  const category = req.query.category || "";
  const sort = req.query.sort || "latest";

  const skip = (page - 1) * limit;

  // User accounts
  const accounts = await accountModel
    .find({
      user: req.user._id,
      status: "ACTIVE",
    })
    .select("_id");

  const accountIds = accounts.map((account) => account._id);

  const query = {
    status: "COMPLETED",
    $or: [
      {
        fromAccount: {
          $in: accountIds,
        },
      },
      {
        toAccount: {
          $in: accountIds,
        },
      },
    ],
  };

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      ...(query.$or || []),
      {
        merchant: {
          $regex: search,
          $options: "i",
        },
      },
      {
        description: {
          $regex: search,
          $options: "i",
        },
      },
      {
        category: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  let sortQuery = {};

  switch (sort) {
    case "oldest":
      sortQuery = { createdAt: 1 };
      break;

    case "amount_asc":
      sortQuery = { amount: 1 };
      break;

    case "amount_desc":
      sortQuery = { amount: -1 };
      break;

    default:
      sortQuery = { createdAt: -1 };
  }

  const transactions = await transactionModel
    .find(query)
    .populate("fromAccount", "name currency")
    .populate("toAccount", "name currency")
    .sort(sortQuery)
    .skip(skip)
    .limit(limit);

  const formattedTransactions = transactions
    .map((transaction) => {
      const isIncoming = accountIds.some(
        (id) => id.toString() === transaction.toAccount._id.toString(),
      );

      return {
        ...transaction.toObject(),
        direction: isIncoming ? "IN" : "OUT",
      };
    })
    .filter((transaction) => {
      if (!direction) return true;
      return transaction.direction === direction;
    });

  const totalTransactions = await transactionModel.countDocuments(query);

  return sendResponse(res, 200, "Transactions fetched successfully", {
    transactions: formattedTransactions,
    pagination: {
      page,
      limit,
      totalTransactions,
      totalPages: Math.ceil(totalTransactions / limit),
    },
  });
}

async function getTransactionDetails(req, res) {
  const transaction = await transactionService.getTransactionDetailsService(
    req.params.id,
    req.user
  );

  return sendResponse(
    res,
    200,
    "Transaction fetched successfully",
    transaction
  );
}

module.exports = {
  createTransaction,
  createInitialFundsTransaction,
  getUserTransactions,
  getTransactionDetails,
};
