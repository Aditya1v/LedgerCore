require("dotenv").config();

const mongoose = require("mongoose");
const crypto = require("crypto");

const connectDB = require("../src/config/db");

const userModel = require("../src/models/user.model");
const accountModel = require("../src/models/account.model");
const transactionModel = require("../src/models/transaction.model");
const ledgerModel = require("../src/models/ledger.model");

const TRANSACTION_COUNT = 100;

const ACCOUNT_TYPES = ["SAVINGS", "CURRENT"];

const CATEGORIES = [
  {
    category: "Food",
    merchants: ["Dominos", "McDonalds", "Burger King", "Pizza Hut"],
    min: 200,
    max: 1200,
  },
  {
    category: "Shopping",
    merchants: ["Amazon", "Flipkart", "Myntra", "Ajio"],
    min: 1000,
    max: 12000,
  },
  {
    category: "Fuel",
    merchants: ["Indian Oil", "HP", "Shell"],
    min: 500,
    max: 3500,
  },
  {
    category: "Bills",
    merchants: ["Electricity", "Water Bill", "Broadband"],
    min: 700,
    max: 8000,
  },
  {
    category: "Travel",
    merchants: ["Uber", "Ola", "IRCTC"],
    min: 400,
    max: 6000,
  },
  {
    category: "Healthcare",
    merchants: ["Apollo", "MedPlus"],
    min: 500,
    max: 7000,
  },
  {
    category: "Entertainment",
    merchants: ["Netflix", "BookMyShow", "Spotify"],
    min: 199,
    max: 3000,
  },
  {
    category: "Investment",
    merchants: ["Groww", "Zerodha"],
    min: 2000,
    max: 25000,
  },
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

function randomDateWithinMonths(months = 8) {
  const date = new Date();

  date.setMonth(date.getMonth() - randomInt(0, months));

  date.setDate(randomInt(1, 28));

  return date;
}

function generateKey() {
  return crypto.randomUUID();
}

async function clearDatabase() {
  console.log("🧹 Clearing database...");

  await ledgerModel.deleteMany({});
  await transactionModel.deleteMany({});
  await accountModel.deleteMany({});
  await userModel.deleteMany({});

  console.log("✅ Database cleared\n");
}

async function createUsers() {
  console.log("👤 Creating users...");

  const users = {};

  users.system = await userModel.create({
    name: "SYSTEM",
    email: "system@ledgercore.com",
    password: "Password@123",
    systemUser: true,
  });

  users.aditya = await userModel.create({
    name: "Aditya",
    email: "aditya@test.com",
    password: "Password@123",
  });

  users.rahul = await userModel.create({
    name: "Rahul",
    email: "rahul@test.com",
    password: "Password@123",
  });

  users.aman = await userModel.create({
    name: "Aman",
    email: "aman@test.com",
    password: "Password@123",
  });

  console.log("✅ Users created\n");

  return users;
}

async function createAccounts(users) {
  console.log("🏦 Creating accounts...");

  const accounts = {};

  accounts.system = await accountModel.create({
    user: users.system._id,
    name: "SYSTEM ACCOUNT",
    type: "CURRENT",
  });

  accounts.adityaSavings = await accountModel.create({
    user: users.aditya._id,
    name: "Aditya Savings",
    type: "SAVINGS",
  });

  accounts.adityaSalary = await accountModel.create({
    user: users.aditya._id,
    name: "Aditya Salary",
    type: "CURRENT",
  });

  accounts.rahulSavings = await accountModel.create({
    user: users.rahul._id,
    name: "Rahul Savings",
    type: "SAVINGS",
  });

  accounts.rahulBusiness = await accountModel.create({
    user: users.rahul._id,
    name: "Rahul Business",
    type: "CURRENT",
  });

  accounts.amanSavings = await accountModel.create({
    user: users.aman._id,
    name: "Aman Savings",
    type: "SAVINGS",
  });

  accounts.amanEmergency = await accountModel.create({
    user: users.aman._id,
    name: "Aman Emergency",
    type: "SAVINGS",
  });

  console.log("✅ Accounts created\n");

  return accounts;
}

async function createLedgerTransaction({
  fromAccount,
  toAccount,
  amount,
  category,
  merchant = "",
  description = "",
  transactionType = "TRANSFER",
  createdAt = new Date(),
}) {
  const transaction = await transactionModel.create({
    fromAccount: fromAccount._id,
    toAccount: toAccount._id,
    amount,

    transactionType,
    category,
    merchant,
    description,

    status: "COMPLETED",
    idempotencyKey: generateKey(),

    createdAt,
    updatedAt: createdAt,
  });

  await ledgerModel.create([
    {
      account: fromAccount._id,
      transaction: transaction._id,
      amount,
      type: "DEBIT",
    },
    {
      account: toAccount._id,
      transaction: transaction._id,
      amount,
      type: "CREDIT",
    },
  ]);

  return transaction;
}

async function seedInitialFunding(accounts) {
  console.log("💰 Funding accounts...");

  const funding = [
    accounts.adityaSavings,
    accounts.adityaSalary,
    accounts.rahulSavings,
    accounts.rahulBusiness,
    accounts.amanSavings,
    accounts.amanEmergency,
  ];

  for (const account of funding) {
    await createLedgerTransaction({
      fromAccount: accounts.system,
      toAccount: account,
      amount: 100000,
      category: "Initial Funding",
      description: "Seed Initial Balance",
      transactionType: "DEPOSIT",
      createdAt: randomDateWithinMonths(),
    });
  }

  console.log("✅ Initial funding completed\n");
}

async function generateTransactions(accounts) {
  console.log(`💸 Generating ${TRANSACTION_COUNT} transactions...\n`);

  const userAccounts = [
    accounts.adityaSavings,
    accounts.adityaSalary,
    accounts.rahulSavings,
    accounts.rahulBusiness,
    accounts.amanSavings,
    accounts.amanEmergency,
  ];

  let created = 0;

  while (created < TRANSACTION_COUNT) {
    let fromAccount = randomItem(userAccounts);
    let toAccount = randomItem(userAccounts);

    if (fromAccount._id.equals(toAccount._id)) continue;

    const template = randomItem(CATEGORIES);

    const amount = randomInt(template.min, template.max);

    try {
      const balance = await fromAccount.getBalance();

      if (balance < amount) continue;

      await createLedgerTransaction({
        fromAccount,
        toAccount,
        amount,

        category: template.category,
        merchant: randomItem(template.merchants),

        description: `${template.category} payment`,

        transactionType: "TRANSFER",

        createdAt: randomDateWithinMonths(),
      });

      created++;
    } catch (err) {
      console.log(err.message);
    }
  }

  console.log(`✅ ${created} transactions created\n`);
}

async function printSummary() {
  const users = await userModel.countDocuments();

  const accounts = await accountModel.countDocuments();

  const transactions = await transactionModel.countDocuments();

  const ledgers = await ledgerModel.countDocuments();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log("🌱 LedgerCore Seeder Completed");

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  console.log(`👤 Users          : ${users}`);
  console.log(`🏦 Accounts       : ${accounts}`);
  console.log(`💸 Transactions   : ${transactions}`);
  console.log(`📒 Ledger Entries : ${ledgers}`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

async function main() {
  try {
    await connectDB();

    await clearDatabase();

    const users = await createUsers();

    const accounts = await createAccounts(users);

    await seedInitialFunding(accounts);

    await generateTransactions(accounts);

    await printSummary();

    process.exit(0);
  } catch (err) {
    console.error(err);

    process.exit(1);
  }
}

main();