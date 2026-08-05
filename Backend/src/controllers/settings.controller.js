const settingsService = require("../services/settings.service");
const sendResponse = require("../utils/sendResponse");

/**
 * GET /api/settings
 */
async function getSettingsController(req, res) {
  const settings = await settingsService.getSettings(req.user);

  return sendResponse(
    res,
    200,
    "Settings fetched successfully",
    settings
  );
}

/**
 * PUT /api/settings
 */
async function updateSettingsController(req, res) {
  const settings = await settingsService.updateSettings(
    req.user,
    req.body
  );

  return sendResponse(
    res,
    200,
    "Settings updated successfully",
    settings
  );
}

module.exports = {
  getSettingsController,
  updateSettingsController,
};