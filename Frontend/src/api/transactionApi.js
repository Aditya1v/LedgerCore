import api from "./api";

export const createTransactionApi = async (data) => {
  const response = await api.post("/transactions", data);
  return response.data;
};

export const getTransactionsApi = async (params = {}) => {
  const response = await api.get("/transactions", {
    params,
  });

  return response.data;
};

export const getTransactionDetailsApi = async (transactionId) => {
  const response = await api.get(`/transactions/${transactionId}`);
  return response.data;
};