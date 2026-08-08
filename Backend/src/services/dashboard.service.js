const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transaction.model");

const getDashboardSummaryService = async (user) => {
  const [totalAccounts, userAccounts, summary] = await Promise.all([
    accountModel.countDocuments({
      user: user._id,
      status: "ACTIVE",
    }),
    accountModel
      .find({
        user: user._id,
        status: "ACTIVE",
      })
      .select("_id"),

    ledgerModel.aggregate([
      {
        $lookup: {
          from: "accounts",
          localField: "account",
          foreignField: "_id",
          as: "accountDetails",
        },
      },
      {
        $unwind: "$accountDetails",
      },
      {
        $match: {
          "accountDetails.user": user._id,
        },
      },
      {
        $group: {
          _id: null,

          totalCredit: {
            $sum: {
              $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0],
            },
          },

          totalDebit: {
            $sum: {
              $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,

          totalIncome: "$totalCredit",

          totalExpense: "$totalDebit",

          totalBalance: {
            $subtract: ["$totalCredit", "$totalDebit"],
          },
        },
      },
    ]),
  ]);

  const accountIds = userAccounts.map((account) => account._id);

  const recentTransactions = await transactionModel
    .find({
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
    })
    .select(
      "fromAccount toAccount amount status createdAt category transactionType",
    )
    .sort({
      createdAt: -1,
    })
    .limit(5)
    .populate("fromAccount", "currency")
    .populate("toAccount", "currency");

  const recentTransactionsWithDirection = recentTransactions.map((tx) => {
    const transaction = tx.toObject();

    transaction.direction = accountIds.some((id) =>
      id.equals(transaction.toAccount._id),
    )
      ? "IN"
      : "OUT";

    return transaction;
  });

  const financialSummary = summary[0] || {
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
  };

  return {
    totalBalance: financialSummary.totalBalance,
    totalIncome: financialSummary.totalIncome,
    totalExpense: financialSummary.totalExpense,
    totalAccounts,
    recentTransactions: recentTransactionsWithDirection,
  };
};

module.exports = {
  getDashboardSummaryService,
};
