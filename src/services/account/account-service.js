import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { ACCOUNT_LEDGER, ACCOUNTS, ACCOUNTS_TREE, JOURNAL_ITEM } from "../endpoints";

export const getAccounts = () => apiGet(ACCOUNTS);

export const getAccountTree = () => apiGet(ACCOUNTS_TREE);

export const createAccount = (data) => apiPost(ACCOUNTS, data);


export const getAccountsList = ({
  page = 1,
  limit = 10,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  filter,
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    searchTerm,
    start_date,
    end_date,
    sort,
    filter,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${ACCOUNTS}?${query.toString()}`);
};

export const getAccountById = (id) => {
  return apiGet(`${ACCOUNTS}/${id}`);
};

export const updateAccount = ({ id, data }) => {
  return apiUpdate(`${ACCOUNTS}/${id}`, data);
};
export const deleteAccount = (id) => {
  return apiDelete(`${ACCOUNTS}/${id}`);
};

export const getAccountLedger = (accountId) => {
  return apiGet(`${ACCOUNT_LEDGER}/${accountId}/ledger`);
};

export const getItemTransactions = (id) => {
  return apiGet(`${JOURNAL_ITEM}/${id}`);
};