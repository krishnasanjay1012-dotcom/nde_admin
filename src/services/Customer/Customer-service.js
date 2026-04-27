import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import {
  EMAIL_LOG,
  CLIENT_UPDATE,
  CUSTOMER_DETAILS,
  CREATE_CUSTOMER,
  ADD_WORKSPACE,
  CUSTOMER_LIST,
  GSUITE_BY_CLIENT,
  DOMAIN_BY_CLIENT,
  PLESK_DATA_BY_CLIENT,
  TLD_RESELLERS,
  INVOICE_BY_CLIENT,
  PURCHASED_PRODUCTS,
  WORKSPACE_LIST,
  WORKSPACE_DETAILS,
  LOGS,
  PAYMENT_DETAILS,
  DELETE_CLIENT,
  CLIENT_MAP_WORKSPACE,
  RESELLERS_MIGRATE,
  PLESK_MIGRATE,
  GSUITE_MIGRATE,
  BULK_DELETE_CLIENT,
  WORKSPACE_UPDATE,
  GET_USER_BY_WORKSPACE,
  ADMIN_UPDATE_PASSWORD,
  WALLET_ADD_FUND,
  PAYMENT_OPENING_BALANCE,
  WALLET_UPDATE_TRANSACTION,
  USER_OUTSTANDING_PAYMENTS,
  RENEWAL_DASHBOARD,
  SUBSCRIPTION_BY_USER,
  MOVE_CUSTOMERS_TO_ADMIN,
  CLIENT_CUSTOM_VIEW,
  TRANSACTION_DEPOSIT_LIST,
  STATEMENT_DETAILS,
  GET_CONTACT_PERSON,
  CUSTOMER_IMPORT_EXCEL,
  UNPAID_INVOICE,
  WALLET,
} from "../endpoints";
import { webserviceGet, webservicePost } from "../web-service.instonce";
import { authPost } from "../auth.instance";

export const getAllCustomers = ({
  page,
  limit,
  filter,
  searchTerm,
  start_date,
  end_date,
  sort,
}) => {
  return apiGet(
    `${CUSTOMER_LIST}?page=${page || 1}&limit=${limit || 10}&searchTerm=${searchTerm || ""}&filter=${filter || ""}&start_date=${start_date || ""}&end_date=${end_date || ""}&sort=${sort || ""}`,
  );
};

export const getCustomerDetails = ({ id }) => {
  return apiGet(`${CUSTOMER_DETAILS}${id}`);
};

export const clientSignup = (data) => {
  return authPost(CREATE_CUSTOMER, data);
};
export const updateClientById = (clientId, data) => {
  return apiUpdate(`${CLIENT_UPDATE}/${clientId}`, data);
};

export const getGsuiteByClient = ({ page, limit, userId, workspace_Id }) => {
  return webserviceGet(
    `${GSUITE_BY_CLIENT}?page=${page}&limit=${limit}&userId=${userId}&workspace_Id=${workspace_Id}`,
  );
};
export const getDomains = ({ page = 1, limit = 10, userId, workspace_Id }) => {
  return webserviceGet(
    `${DOMAIN_BY_CLIENT}?page=${page}&limit=${limit}&userId=${userId}&workspace_Id=${workspace_Id}`,
  );
};

// Get Plesk data
export const getPleskData = ({
  page = 1,
  limit = 10,
  userId,
  workspace_Id,
}) => {
  return webserviceGet(
    `${PLESK_DATA_BY_CLIENT}?page=${page}&limit=${limit}&userId=${userId}&workspace_Id=${workspace_Id}`,
  );
};

export const getResellerTLDs = () => {
  return webserviceGet(TLD_RESELLERS);
};
export const deleteClient = (clientId) => {
  return apiDelete(`${DELETE_CLIENT}/${clientId}`);
};
export const getInvoicesByClient = ({
  page,
  limit,
  filter,
  date_filter,
  customStartDate,
  customEndDate,
  workspace_Id,
  isRecordPayment
}) => {
  return apiGet(
    `${INVOICE_BY_CLIENT}?page=${page}&limit=${limit}&filter=${filter}&date_filter=${date_filter}&customStartDate=${customStartDate}&customEndDate=${customEndDate}&workspace_Id=${workspace_Id}&isRecordPayment=${isRecordPayment}`,
  );
};

// Get purchased products
export const getPurchasedProducts = ({
  page = 1,
  limit = 10,
  workspace_Id,
}) => {
  return apiGet(
    `${PURCHASED_PRODUCTS}/${workspace_Id}?page=${page}&limit=${limit}`,
  );
};

export const addWorkspace = (data) => {
  return apiPost(ADD_WORKSPACE, data);
};

export const getWorkspaceList = (userId) => {
  return apiGet(`${WORKSPACE_LIST}/${userId}`);
};

export const getWorkspaceDetails = ({ workspace_Id, userId }) => {
  return apiGet(
    `${WORKSPACE_DETAILS}?workspace_Id=${workspace_Id}&userId=${userId}`,
  );
};

export const getEmailLog = ({ userId, workspace_Id, page = 1, limit = 10 }) => {
  return apiGet(
    `${EMAIL_LOG}?userId=${userId}&workspace_Id=${workspace_Id}&page=${page}&limit=${limit}`,
  );
};
export const getLogs = ({
  userId,
  workspace_Id,
  page = 1,
  limit = 10,
  filter,
}) => {
  return apiGet(
    `${LOGS}?userId=${userId}&workspace_Id=${workspace_Id}&page=${page}&limit=${limit}&filter=${filter}`,
  );
};

export const getPaymentDetails = ({
  workspace_Id,
  page = 1,
  limit = 10,
}) => {
  return apiGet(
    `${PAYMENT_DETAILS}?workspace_Id=${workspace_Id}&page=${page}&limit=${limit}`,
  );
};

export const mapWorkspaceToClient = (data) => {
  return apiUpdate(CLIENT_MAP_WORKSPACE, data);
};

export const migrateResellers = (data) => {
  return webservicePost(RESELLERS_MIGRATE, data);
};

export const migratePlesk = (data) => {
  return webservicePost(PLESK_MIGRATE, data);
};

export const migrateGSuite = (data) => {
  return webservicePost(GSUITE_MIGRATE, data);
};

export const bulkDeleteClients = (data) => {
  return apiDelete(BULK_DELETE_CLIENT, data);
};

export const workspaceUpdate = (_id, data) => {
  return apiUpdate(`${WORKSPACE_UPDATE}/${_id}`, data);
};

export const getContactPerson = (_id) => {
  return apiGet(`${GET_CONTACT_PERSON}?workspaceId=${_id}`);
};

export const getUserByWorkspace = (workspace_Id) => {
  return apiGet(`${GET_USER_BY_WORKSPACE}/${workspace_Id}`);
};

export const updateAdminPassword = (data) => {
  return apiUpdate(ADMIN_UPDATE_PASSWORD, data);
};

export const addWalletFund = (formData) => {
  return apiPost(WALLET_ADD_FUND, formData);
};

export const updateOpeningBalance = (data) => {
  return apiUpdate(PAYMENT_OPENING_BALANCE, data);
};

export const updateWalletTransaction = (data) => {
  return apiUpdate(WALLET_UPDATE_TRANSACTION, data);
};

// Customer Details

export const getUserOutstandingPayments = ({
  worksapce_id,
  status,
  page = 1,
  limit = 10,
}) => {
  return apiGet(
    `${USER_OUTSTANDING_PAYMENTS}/${worksapce_id}?status=${status}&page=${page}&limit=${limit}`,
  );
};

export const getRenewalDataByDate = ({
  page = 1,
  limit = 10,
  service,
  user,
}) => {
  return apiGet(
    `${RENEWAL_DASHBOARD}?page=${page}&limit=${limit}&service=${service}&user=${user}`,
  );
};

export const getSubscriptionsByUser = ({ workspaceId }) => {
  return apiGet(`${SUBSCRIPTION_BY_USER}?workspaceId=${workspaceId}`);
};

export const moveCustomersToAdmin = ({ adminId, users }) => {
  return apiPost(`${MOVE_CUSTOMERS_TO_ADMIN}/${adminId}`, { users });
};

// View

export const getClientCustomView = ({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    start_date,
    end_date,
    sort,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${CLIENT_CUSTOM_VIEW}?${query.toString()}`);
};

export const getDepositAccounts = (module = "") => {
  return apiGet(`${TRANSACTION_DEPOSIT_LIST}?module=${module}`);
};

export const getUserStatement = ({ workspaceId, filter, type = "" }, config = {}) => {
  return apiGet(
    `${STATEMENT_DETAILS}?workspaceId=${workspaceId}&filter=${filter}&type=${type}`,
    config
  );
};

export const importCustomerExcel = (formData) => {
  return apiPost(CUSTOMER_IMPORT_EXCEL, formData);
};
export const getUnpaidInvoice = (userId) => {
  return apiGet(`${UNPAID_INVOICE}/${userId}`);
};


export const getOpeningBalance = (workspaceId) => {
  return apiGet(`${WALLET}?workspaceId=${workspaceId}`);
};


export const deleteWriteOff = (workspaceId) => {
  return apiDelete(`${WALLET}/writeOff/${workspaceId}`);
};

export const writeOffOpeningBalance = (data) => {
  return apiPost(`${WALLET}/writeOff`, data);
};
export const setOpeningBalance = (data) => {
  return apiPost(`${WALLET}`, data);
};