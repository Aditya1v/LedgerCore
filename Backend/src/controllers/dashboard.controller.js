// import { getDashboardSummaryService } from "../services/dashboard.service.js";
const {getDashboardSummaryService} = require('../services/dashboard.service')

const getDashboardSummary = async (req, res) => {
  try {
    const summary = await getDashboardSummaryService(req.user);

    return res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardSummary,
};