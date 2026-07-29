import { getDashboardSummary } from "../api/dashboard.api";

export const fetchDashboardSummary = async () => {
  const response = await getDashboardSummary();
  return response.data;
};