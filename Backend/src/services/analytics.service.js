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
  const monthlyData = await transactionModel.aggregate([
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
            date: "$createdAt",
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
            $cond: [
              {
                $in: ["$toAccount", accountIds],
              },
              "$amount",
              0,
            ],
          },
        },

        expense: {
          $sum: {
            $cond: [
              {
                $in: ["$fromAccount", accountIds],
              },
              "$amount",
              0,
            ],
          },
        },
      },
    },

    {
      $sort: {
        _id: 1,
      },
    },
  ]);
  return {
    monthlyData,
  };
}

module.exports = {
  getAnalytics,
};
