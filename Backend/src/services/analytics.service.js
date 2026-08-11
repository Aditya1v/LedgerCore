const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");

async function getAnalytics(user) {
  const accounts = await accountModel
    .find({
      user: user._id,
      status: "ACTIVE",
    })
    .select("_id");

  const accountIds = accounts.map((account) => account._id);

  const [monthlyData, transactionStats, categorySpending] = await Promise.all([
    // Monthly Data
    transactionModel.aggregate([
      {
        $match: {
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
          status: "COMPLETED",
        },
      },

      {
        $project: {
          month: {
            $dateToString: {
              format: "%Y-%m",
              date: {
                $ifNull: ["$transactionDate", "$createdAt"],
              },
            },
          },
          amount: 1,
          fromAccount: 1,
          toAccount: 1,
        },
      },

      {
        $group: {
          _id: "$month",

          income: {
            $sum: {
              $cond: [{ $in: ["$toAccount", accountIds] }, "$amount", 0],
            },
          },

          expense: {
            $sum: {
              $cond: [{ $in: ["$fromAccount", accountIds] }, "$amount", 0],
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
          month: "$_id",
          income: 1,
          expense: 1,
        },
      },

      {
        $sort: {
          month: 1,
        },
      },
    ]),

    // Transaction Stats
    transactionModel.aggregate([
      {
        $match: {
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
          status: "COMPLETED",
        },
      },

      {
        $group: {
          _id: null,

          transactionCount: {
            $sum: 1,
          },

          averageTransaction: {
            $avg: "$amount",
          },

          largestIncome: {
            $max: {
              $cond: [{ $in: ["$toAccount", accountIds] }, "$amount", 0],
            },
          },

          largestExpense: {
            $max: {
              $cond: [{ $in: ["$fromAccount", accountIds] }, "$amount", 0],
            },
          },
        },
      },
    ]),

    //Category-wise Spending
    transactionModel.aggregate([
      {
        $match: {
          fromAccount: { $in: accountIds },
          status: "COMPLETED",
        },
      },
      {
        $group: {
          _id: "$category",
          amount: {
            $sum: "$amount",
          },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: 1,
        },
      },
      {
        $sort: {
          amount: -1,
        },
      },
    ]),
  ]);

  const stats = transactionStats[0] || {
    transactionCount: 0,
    averageTransaction: 0,
    largestIncome: 0,
    largestExpense: 0,
  };

  return {
    monthlyData,
    transactionCount: stats.transactionCount,
    averageTransaction: Math.round(stats.averageTransaction),
    largestIncome: stats.largestIncome,
    largestExpense: stats.largestExpense,

    categorySpending,
  };
}

module.exports = {
  getAnalytics,
};
