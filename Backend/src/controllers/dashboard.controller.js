// import { getDashboardSummaryService } from "../services/dashboard.service.js";
const {getDashboardSummaryService} = require('../services/dashboard.service')

const getDashboardSummary = async (req, res) => {
  const summary = await getDashboardSummaryService(req.user);

  return res.status(200).json({
    success: true,
    data: summary,
  });
};

module.exports = {
  getDashboardSummary,
};