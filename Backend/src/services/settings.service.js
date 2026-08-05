const settingsModel = require("../models/settings.model");

async function getSettings(user) {
  let settings = await settingsModel.findOne({
    user: user._id,
  });

  // Create default settings for first-time users
  if (!settings) {
    settings = await settingsModel.create({
      user: user._id,
    });
  }

  return settings;
}

async function updateSettings(user, data) {
  let settings = await settingsModel.findOne({
    user: user._id,
  });

  if (!settings) {
    settings = await settingsModel.create({
      user: user._id,
    });
  }

  const allowedFields = [
    "theme",
    "currency",
    "emailNotifications",
    "transactionAlerts",
    "marketingEmails",
  ];

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      settings[field] = data[field];
    }
  });

  await settings.save();

  return settings;
}

module.exports = {
  getSettings,
  updateSettings,
};