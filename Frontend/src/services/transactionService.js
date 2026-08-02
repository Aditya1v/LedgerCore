import {
  getTransactionsApi,
  createTransactionApi,
} from "../api/transactionApi";

export const getTransactions = async () => {
  return await getTransactionsApi();
};

export const createTransaction = async (data) => {
  return await createTransactionApi(data);
};