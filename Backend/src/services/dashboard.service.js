const accountModel = require("../models/account.model");
const ledgerModel = require("../models/legder.model");

const getDashboardSummaryService = async (user) => {
  console.log("User ID:", user._id);

  const totalAccounts = await accountModel.countDocuments({
    user: user._id,
    status: "ACTIVE",
  });

  console.log("Total Accounts:", totalAccounts);
  const summary = await ledgerModel.aggregate([
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
  ]);
  const financialSummary = summary[0] || {
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
  };

  console.log(summary);
  console.log(summary.length);
  return {
    totalBalance: financialSummary.totalBalance,
    totalIncome: financialSummary.totalIncome,
    totalExpense: financialSummary.totalExpense,
    totalAccounts,
    recentTransactions: [],
  };
};

module.exports = {
  getDashboardSummaryService,
};
