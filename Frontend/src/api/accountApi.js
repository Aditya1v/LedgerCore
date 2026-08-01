import api from "./api";

export const getAccountsApi = () => {
  return api.get("/accounts");
};

export const createAccountApi = (accountData) => {
  return api.post("/accounts", accountData);
};