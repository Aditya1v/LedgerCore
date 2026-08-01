import { getTransactionsApi } from "../api/transactionApi";

export const getTransactions = async () => {
  return await getTransactionsApi();
};