import api from "./api";

export const createTransactionApi = async (data) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const getTransactionsApi = async () => {
  const response = await api.get("/transactions");
  return response.data;
};