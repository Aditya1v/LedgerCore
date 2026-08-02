import {
  getTransactionsApi,
  createTransactionApi,
} from "../api/transactionApi";

export const getTransactions = async (params = {}) => {
  return await getTransactionsApi(params);
};

export const createTransaction = async (data) => {
  return await createTransactionApi(data);
};