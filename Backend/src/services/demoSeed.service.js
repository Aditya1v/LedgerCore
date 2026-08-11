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


// Demo Transaction Date

/**
 * Generate a historical date for demo transactions.
 *
 * Transactions are distributed across 7 months:
 *
 * 0 = current month
 * 1 = previous month
 * 2 = two months ago
 * ...
 * 6 = six months ago
 *
 * Using index % 7 guarantees that every month
 * receives transactions.
 */
function demoTransactionDate(index) {
  const date = new Date();

  // Prevent month rollover problems
  // when today's date is 29, 30, or 31.
  date.setDate(1);

  const monthIndex = index % 7;

  date.setMonth(date.getMonth() - monthIndex);

  // Random day
  date.setDate(randomBetween(1, 28));

  // Random time
  date.setHours(
    randomBetween(0, 23),
    randomBetween(0, 59),
    randomBetween(0, 59),
    0,
  );

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
    .findOne({
      systemUser: true,
    })
    .select("+systemUser");

  if (systemUser) {
    return systemUser;
  }

  systemUser = await userModel.create({
    name: "LedgerCore System",
    email: "system@ledgercore.com",
    password: "system123",
    systemUser: true,
  });

  return systemUser;
}


// Account Helpers
async function getOrCreateAccount(userId, name, type = "CURRENT") {
  let account = await accountModel.findOne({
    user: userId,
    name,
  });

  if (account) {
    return account;
  }

  account = await accountModel.create({
    user: userId,
    name,
    type,
    currency: "INR",
  });

  return account;
}


// System / Merchant Accounts
async function createMerchantAccounts(systemUser) {
  const treasury = await getOrCreateAccount(
    systemUser._id,
    "LedgerCore Treasury",
    "CURRENT",
  );

  const merchants = [];

  for (const name of MERCHANTS) {
    const account = await getOrCreateAccount(systemUser._id, name, "CURRENT");

    merchants.push(account);
  }

  return {
    treasury,
    merchants,
  };
}


// Demo User Accounts
async function createDemoAccounts(user) {
  const existingAccounts = await accountModel.find({
    user: user._id,
  });

  // Don't create duplicate demo accounts.
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

// Force Demo Transaction Date
async function setDemoTransactionDate(transactionId, date) {
  await transactionModel.collection.updateOne(
    {
      _id: transactionId,
    },
    {
      $set: {
        createdAt: date,
        updatedAt: date,
      },
    },
  );
}


// Seed Demo Transactions
async function seedTransactions(accounts) {
  const savings = accounts.find((account) => account.type === "SAVINGS");

  if (!savings) {
    throw new Error("Demo Savings Account not found.");
  }


  // IMPORTANT:
  // If demo transactions already exist,
  // DO NOT create or modify anything.

  const existingTransactions = await transactionModel.countDocuments({
    $or: [
      {
        fromAccount: savings._id,
      },
      {
        toAccount: savings._id,
      },
    ],
  });

  if (existingTransactions > 0) {
    console.log(
      `ℹ️ Demo data already exists (${existingTransactions} transactions). Skipping seed.`,
    );

    return;
  }

  console.log("🌱 Creating demo transactions for the first time...");

  const systemUser = await getSystemUser();

  const { treasury, merchants } = await createMerchantAccounts(systemUser);


  // Initial Demo Balance
  const initialDate = demoTransactionDate(6);

  const initialResult = await transactionService.performTransfer(
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

      transactionDate: initialDate,
    },
  );

  // Force MongoDB createdAt
  // to the historical demo date.
  await setDemoTransactionDate(initialResult.transaction._id, initialDate);


  // Demo Expenses
  for (let i = 1; i <= 100; i++) {
    const expense = randomItem(EXPENSES);

    const merchantAccount = randomItem(merchants);

    // Generate ONE date and use
    // that same date everywhere.
    const demoDate = demoTransactionDate(i);

    const result = await transactionService.performTransfer(
      {
        fromAccount: savings._id,

        toAccount: merchantAccount._id,

        amount: randomBetween(expense.min, expense.max),

        transactionType: "TRANSFER",

        category: expense.category,

        merchant: randomItem(expense.merchants),

        description: `${expense.category} Expense`,

        tags: [expense.category.toLowerCase()],

        idempotencyKey: `demo-expense-${i}-${Date.now()}`,
      },
      {
        skipBalanceCheck: true,

        transactionDate: demoDate,
      },
    );

    // IMPORTANT:
    // Mongoose automatically sets createdAt
    // to the current date when creating the
    // transaction.
    //
    // Therefore we explicitly overwrite it
    // directly in MongoDB for demo data.
    await setDemoTransactionDate(result.transaction._id, demoDate);
  }

  console.log("✅ Demo transactions seeded successfully across 7 months.");
}


// Entry Point
async function setupDemoData(user) {
  const accounts = await createDemoAccounts(user);

  await seedTransactions(accounts);

  return accounts;
}

// Exports
module.exports = {
  setupDemoData,
};
