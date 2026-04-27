import { webserviceGet, webservicePost, webserviceUpdate } from "../web-service.instonce";
import { DEPOSIT_ACCOUNTS, GSUITE_BULK_UPDATE, GSUITE_IMPORT_EXCEL, GSUITE_TRANSACTION_BY_DOMAIN, GSUITE_TRANSACTIONS, LEDGER_ACCOUNTS, PAYMENT, PAYMENT_MODES, PAYMENT_OPEN, PAYMENT_UNVOID, PAYMENT_VOID } from "../endpoints";
import { apiDelete, apiGet, apiPatch, apiPost, apiUpdate } from "../axios-instance";

export const importGSuiteExcel = (formData) => {
  return webservicePost(GSUITE_IMPORT_EXCEL, formData);
};

export const getGSuiteTransactions = ({ query = "", sort = "", limit = 10, page = 1, filter = "", start_date = "", end_date = "" }) => {
  return webserviceGet(`${GSUITE_TRANSACTIONS}?query=${query}&sort=${sort}&limit=${limit}&page=${page}&filter=${filter}&start_date=${start_date}&end_date=${end_date}`);
};

export const updateGSuiteTransaction = (data) => {
  return webserviceUpdate(GSUITE_TRANSACTIONS, data);
};

export const bulkMapGSuiteTransactions = (data) => {
  return webserviceUpdate(GSUITE_BULK_UPDATE, data);
};

export const getGSuiteTransactionByDomain = ({ domain, filter, year, limit = 10, page = 1 }) => {
  return webserviceGet(`${GSUITE_TRANSACTION_BY_DOMAIN}?domain=${domain}&filter=${filter}&year=${year}&limit=${limit}&page=${page}`);
};


// Paymnet Recived 


export const getAllPaymentDetails = ({ filter, search, limit = 10, page = 1, sort = "", customFilters }) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    search,
    sort,
    customFilters: JSON.stringify(customFilters),
  });
  return apiGet(`${PAYMENT}?${query.toString()}`);
};

/* Create payment record */
export const createPaymentRecord = (data) => {
  return apiPost(PAYMENT, data);
};

/* Get payment by ID */
export const getPaymentDetailsById = ({ id }) => {
  return apiGet(`${PAYMENT}/${id}`);
};

/* Delete payment by ID */
export const deletePaymentDetailsById = ({ id }) => {
  return apiDelete(`${PAYMENT}/${id}`);
};

/* Get payment modes */
export const getPaymentModes = () => {
  return apiGet(PAYMENT_MODES);
};

/* Get deposit accounts */
export const getFromAccounts = () => {
  return apiGet(DEPOSIT_ACCOUNTS);
};

export const getTdsTaxAccounts = () => {
  return apiGet(LEDGER_ACCOUNTS);
};


// Void
export const voidPayment = (data) => {
  return apiPatch(PAYMENT_VOID, data);
};

/* Unvoid Bill */
export const unvoidPayment = (data) => {
  return apiPatch(PAYMENT_UNVOID, data);
};

export const openPayment = (id) => {
  return apiPatch(`${PAYMENT_OPEN}/${id}`);
};

/* Update payment record */
export const updatePaymentRecord = (id, data) => {
  return apiUpdate(`${PAYMENT}/${id}`, data);
};
