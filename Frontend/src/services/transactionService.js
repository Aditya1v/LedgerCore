import {
  getTransactionsApi,
  createTransactionApi,
  getTransactionDetailsApi,
} from "../api/transactionApi";

export const getTransactions = async (params = {}) => {
  return await getTransactionsApi(params);
};

export const createTransaction = async (data) => {
  return await createTransactionApi(data);
};

export const getTransactionDetails = async (transactionId) => {
  const response = await getTransactionDetailsApi(transactionId);
  return response.data;
};