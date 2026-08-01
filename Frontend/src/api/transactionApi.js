import api from "./api";

export const getTransactionsApi = async () => {
  const response = await api.get("/transactions");
  return response.data;
};