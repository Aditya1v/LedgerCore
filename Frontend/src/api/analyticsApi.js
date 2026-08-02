import api from "./api";

export const getAnalyticsApi = async () => {
  const response = await api.get("/analytics");
  return response.data;
};