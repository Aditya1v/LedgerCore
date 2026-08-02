const { getAnalytics } = require("../services/analytics.service");
const sendResponse = require("../utils/sendResponse");

async function getAnalyticsController(req, res) {
  const analytics = await getAnalytics(req.user);

  return sendResponse(
    res,
    200,
    "Analytics fetched successfully",
    analytics
  );
}

module.exports = {
  getAnalyticsController,
};