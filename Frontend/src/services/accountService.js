import { getAccountsApi, createAccountApi } from "../api/accountApi";

export const getAccounts = async () => {
  const response = await getAccountsApi();
  return response.data;
};

export const createAccount = async (accountData) => {
  const response = await createAccountApi(accountData);
  return response.data;
};