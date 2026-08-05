const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },

    theme: {
      type: String,
      enum: ["LIGHT", "DARK", "SYSTEM"],
      default: "SYSTEM",
    },

    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    transactionAlerts: {
      type: Boolean,
      default: true,
    },

    marketingEmails: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const settingsModel = mongoose.model("settings", settingsSchema);

module.exports = settingsModel;