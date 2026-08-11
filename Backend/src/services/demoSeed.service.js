const mongoose = require("mongoose");

const crypto = require("crypto");

const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const transactionModel = require("../models/transaction.model");

const transactionService = require("./transaction.service");

// Helpers

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomDate() {
  const date = new Date();

  date.setMonth(date.getMonth() - randomBetween(0, 5));
  date.setDate(randomBetween(1, 28));

  return date;
}

// Demo Data

const MERCHANTS = [
  "Swiggy",
  "Amazon",
  "Uber",
  "Netflix",
  "Indian Oil",
  "Zomato",
  "Flipkart",
  "Spotify",
  "BookMyShow",
  "Apollo",
  "PharmEasy",
  "Groww",
  "Zerodha",
];

const EXPENSES = [
  {
    category: "Food",
    merchants: ["Swiggy", "Zomato", "Dominos", "McDonald's"],
    min: 150,
    max: 800,
  },
  {
    category: "Shopping",
    merchants: ["Amazon", "Flipkart", "Myntra"],
    min: 800,
    max: 8000,
  },
  {
    category: "Fuel",
    merchants: ["Indian Oil", "HP Petrol", "BPCL"],
    min: 500,
    max: 3000,
  },
  {
    category: "Bills",
    merchants: ["Electricity Board", "Airtel", "Jio"],
    min: 500,
    max: 5000,
  },
  {
    category: "Entertainment",
    merchants: ["Netflix", "Spotify", "BookMyShow"],
    min: 200,
    max: 1500,
  },
  {
    category: "Travel",
    merchants: ["Uber", "Ola", "IRCTC"],
    min: 200,
    max: 3000,
  },
  {
    category: "Healthcare",
    merchants: ["Apollo", "PharmEasy"],
    min: 300,
    max: 4000,
  },
  {
    category: "Investment",
    merchants: ["Groww", "Zerodha"],
    min: 2000,
    max: 15000,
  },
];

// System User

async function getSystemUser() {
  let systemUser = await userModel
    .findOne({ systemUser: true })
    .select("+systemUser");

  if (systemUser) return systemUser;

  systemUser = await userModel.create({
    name: "LedgerCore System",
    email: "system@ledgercore.com",
    password: crypto.randomUUID(),
    systemUser: true,
  });

  return systemUser;
}

// Creates an account if it doesn't exist, otherwise returns the existing one.
async function getOrCreateAccount(userId, name, type = "CURRENT") {
  let account = await accountModel.findOne({
    user: userId,
    name,
  });

  if (account) return account;

  account = await accountModel.create({
    user: userId,
    name,
    type,
    currency: "INR",
  });

  return account;
}

// Creates the system treasury account and merchant accounts.
async function createMerchantAccounts(systemUser) {
  const treasury = await getOrCreateAccount(
    systemUser._id,
    "LedgerCore Treasury",
    "CURRENT"
  );

  const merchants = [];

  for (const name of MERCHANTS) {
    const account = await getOrCreateAccount(
      systemUser._id,
      name,
      "CURRENT"
    );

    merchants.push(account);
  }

  return {
    treasury,
    merchants,
  };
}

// Creates demo user's banking accounts.
async function createDemoAccounts(user) {
  const existingAccounts = await accountModel.find({
    user: user._id,
  });

  if (existingAccounts.length) {
    return existingAccounts;
  }

  return await accountModel.create([
    {
      user: user._id,
      name: "Savings Account",
      type: "SAVINGS",
      currency: "INR",
    },
    {
      user: user._id,
      name: "Current Account",
      type: "CURRENT",
      currency: "INR",
    },
    {
      user: user._id,
      name: "Cash Wallet",
      type: "CASH",
      currency: "INR",
    },
  ]);
}

// Seeds all demo transactions.
async function seedTransactions(accounts) {
  const savings = accounts.find((a) => a.type === "SAVINGS");

  const existingTransactions = await transactionModel.find({
    $or: [
      { fromAccount: savings._id },
      { toAccount: savings._id },
    ],
  });

  // Existing demo transactions found.
  // Spread their dates across the previous 6 months
  // instead of creating duplicate transactions.
  if (existingTransactions.length > 0) {
    console.log(
      `📊 Found ${existingTransactions.length} existing demo transactions.`
    );

    for (const transaction of existingTransactions) {
      const date = randomDate();

      await transactionModel.updateOne(
        { _id: transaction._id },
        {
          $set: {
            createdAt: date,
            updatedAt: date,
          },
        },
        {
          timestamps: false,
        }
      );
    }

    console.log("✅ Existing demo transactions spread across 6 months.");

    return;
  }

  const systemUser = await getSystemUser();

  const { treasury, merchants } =
    await createMerchantAccounts(systemUser);

  // Initial demo balance
  await transactionService.performTransfer(
    {
      fromAccount: treasury._id,
      toAccount: savings._id,

      amount: 100000,

      transactionType: "DEPOSIT",
      category: "Salary",
      merchant: "LedgerCore",

      description: "Demo Initial Balance",

      tags: ["salary"],

      idempotencyKey: `demo-initial-${Date.now()}`,
    },
    {
      skipBalanceCheck: true,
      transactionDate: randomDate(),
    }
  );

  // Demo expenses
  for (let i = 1; i <= 100; i++) {
    const expense = randomItem(EXPENSES);

    const merchantAccount = randomItem(merchants);

    await transactionService.performTransfer(
      {
        fromAccount: savings._id,
        toAccount: merchantAccount._id,

        amount: randomBetween(
          expense.min,
          expense.max
        ),

        transactionType: "TRANSFER",

        category: expense.category,

        merchant: randomItem(expense.merchants),

        description: `${expense.category} Expense`,

        tags: [
          expense.category.toLowerCase(),
        ],

        idempotencyKey:
          `demo-expense-${i}-${Date.now()}`,
      },
      {
        skipBalanceCheck: true,
        transactionDate: randomDate(),
      }
    );
  }

  console.log(
    "✅ Demo transactions seeded successfully."
  );
}

// Entry point
async function setupDemoData(user) {
  const accounts = await createDemoAccounts(user);

  await seedTransactions(accounts);

  return accounts;
}

module.exports = {
  setupDemoData,
};