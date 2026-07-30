const mongoose = require("mongoose");

const TRANSACTION_TYPES = require("../config/transactionTypes");
const TRANSACTION_STATUSES = require("../config/transactionStatuses");

const transactionSchema = new mongoose.Schema(
  {
    // ==============================
    // Ledger Fields
    // ==============================

    fromAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a from account"],
      index: true,
    },

    toAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "account",
      required: [true, "Transaction must be associated with a to account"],
      index: true,
    },

    amount: {
      type: Number,
      required: [true, "Amount is required for creating a transaction"],
      min: [0.01, "Transaction amount must be greater than zero"],
    },

    // ==============================
    // Business Metadata
    // ==============================

    transactionType: {
      type: String,
      enum: {
        values: TRANSACTION_TYPES,
        message: "Invalid transaction type",
      },
      required: [true, "Transaction type is required"],
      index: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
    },

    merchant: {
      type: String,
      trim: true,
      maxlength: [100, "Merchant name cannot exceed 100 characters"],
      default: "",
    },

    description: {
      type: String,
      trim: true,
      maxlength: [300, "Description cannot exceed 300 characters"],
      default: "",
    },

    tags: {
      type: [
        {
          type: String,
          trim: true,
          lowercase: true,
        },
      ],
      default: [],
    },

    // ==============================
    // Transaction Status
    // ==============================

    status: {
      type: String,
      enum: {
        values: TRANSACTION_STATUSES,
        message: "Invalid transaction status",
      },
      default: "PENDING",
    },

    // ==============================
    // Technical Fields
    // ==============================

    idempotencyKey: {
      type: String,
      required: [true, "Idempotency key is required"],
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const transactionModel = mongoose.model("transaction", transactionSchema);

module.exports = transactionModel;