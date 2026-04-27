import {
  apiGet,
  apiPost,
  apiUpdate,
  apiDelete,
  apiPatch,
} from "../axios-instance";
import {
  INVOICE_VIEW,
  INVOICE_CREATE,
  INVOICE_UPDATE,
  INVOICE_DELETE,
  INVOICE_VIEW_ID,
  INVOICE_IMPORT_EXCEL,
  INVOICE_MAIL_DETAILS,
  CONTACT_PERSON_CREATE,
  STATEMENT_PREVIEW,
  SENT_INVOICE_MAIL,
  SALESPERSON_LIST,
  PAYMENT_MODE_LIST,
  FROM_ACC_LIST,
  CREATE_REFUND,
  INVOICE_BULK_DELETE,
  CREATE_PAYMENT_MODE,
  DELETE_PAYMENT,
  CREATE_WRITEOFF,
  CANCEL_WRITEOFF,
  DEPOSIT_TO_LIST,
  OVERVIEW_CURRENCY_LIST,
  INVOICE_OVERVIEW_LIST,
  SECTIONS_LIST,
  PAYABLE_ACCOUNT_LIST,
  CREATE_TDS,
  CREATE_VOID,
  REMOVE_VOID,
  INVOICE_SENT,
  INVOICE_SHARE,
  INVOICE,
  INVOICE_GENERATE_LINK,
  INVOICE_DISABLE_LINK,
} from "../endpoints";

export const getInvoices = ({
  page = 1,
  limit = 10,
  searchTerm = "",
  filter = "",
  date_filter = "",
  start_date = "",
  end_date = "",
  sort,
  customFilters,
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    date_filter,
    start_date,
    end_date,
    sort,
    customFilters: JSON.stringify(customFilters),
  });
  return apiGet(`${INVOICE_VIEW}?${query.toString()}`);
};

export const getInvoiceById = (id) => {
  return apiGet(`${INVOICE_VIEW_ID}/${id}`);
};

export const getInvoiceMailDetailsId = (id) => {
  return apiGet(`${INVOICE_MAIL_DETAILS}/${id}`);
};

export const createInvoice = (data) => {
  return apiPost(INVOICE_CREATE, data);
};

export const createTDS = (data) => {
  return apiPost(CREATE_TDS, data);
};

export const updateTDS = (id, data) => {
  return apiUpdate(`${CREATE_TDS}/${id}`, data);
};

export const deleteTDS = (id) => {
  return apiDelete(`${CREATE_TDS}/${id}`);
};

export const updateInvoice = (id, data) => {
  return apiUpdate(`${INVOICE_UPDATE}/${id}`, data);
};

export const deleteInvoice = (id) => {
  return apiDelete(`${INVOICE_DELETE}/${id}`);
};

export const BulkDeleteInvoices = (data) => {
  return apiDelete(INVOICE_BULK_DELETE, data);
};

export const importInoiceExcel = (formData) => {
  return apiPost(INVOICE_IMPORT_EXCEL, formData);
};

export const createContactPerson = (data) => {
  return apiPost(CONTACT_PERSON_CREATE, data);
};

export const SendInvoiceMail = (formData) => {
  return apiPost(SENT_INVOICE_MAIL, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getStatementPreview = ({
  start_date = "",
  end_date = "",
  workspaceId,
  userId,
}) => {
  return apiGet(
    `${STATEMENT_PREVIEW}?customerId=${userId}&fromDate=${start_date}&toDate=${end_date}&organization=${workspaceId}`,
  );
};

export const getSalesPersonList = ({ page, limit, search }) => {
  return apiGet(
    `${SALESPERSON_LIST}?page=${page}&limit=${limit}&search=${search}`,
  );
};

export const getPaymentModesList = () => {
  return apiGet(`${PAYMENT_MODE_LIST}`);
};

export const getFromAccList = () => {
  return apiGet(`${FROM_ACC_LIST}`);
};

export const getDespostToList = () => {
  return apiGet(`${DEPOSIT_TO_LIST}`);
};

export const CreateManualInvoice = (data) => {
  return apiPost(`/invoice/manual`, data);
};

export const createRefund = (id, data) => {
  return apiPost(`${CREATE_REFUND}/${id}`, data);
};

export const createPaymentMode = (data) => {
  return apiUpdate(`${CREATE_PAYMENT_MODE}`, data);
};

export const deletePayment = (id) => {
  return apiDelete(`${DELETE_PAYMENT}/${id}`);
};

export const getRefundDetails = (id) => {
  return apiGet(`/payment/${id}`);
};

export const createRecordPayment = (data) => {
  return apiPost(`/payment`, data);
};

export const createVoidInvoice = (isVoid, data) => {
  return apiPost(`${isVoid ? REMOVE_VOID : CREATE_VOID}`, data);
};

export const configurePaymentId = (data) => {
  return apiUpdate(`/count-settings`, data);
};

export const createWriteOff = (data) => {
  return apiPost(`${CREATE_WRITEOFF}`, data);
};

export const cancelWriteOff = (data) => {
  return apiPost(`${CANCEL_WRITEOFF}`, data);
};

export const overviewcurrencylist = () => {
  return apiGet(`${OVERVIEW_CURRENCY_LIST}`);
};

export const getInvoiceOverview = (currency) => {
  return apiGet(`${INVOICE_OVERVIEW_LIST}?currency=${currency}`);
};
export const taxSectionList = () => {
  return apiGet(`${SECTIONS_LIST}`);
};

export const payableAccountList = () => {
  return apiGet(`${PAYABLE_ACCOUNT_LIST}?category=Other Current Liability`);
};

export const receivableAccountList = () => {
  return apiGet(`${PAYABLE_ACCOUNT_LIST}?category=Other Current Asset`);
};

export const sentInvoice = (id) => {
  return apiPatch(`${INVOICE_SENT}/${id}/sent`);
};

export const getShareLink = ({ id, linkType, expireDate }) => {
  return apiGet(
    `${INVOICE_SHARE}?id=${id}&linkType=${linkType}&expireDate=${expireDate}&transactionType=invoice`,
  );
};

export const generateInvoiceLink = ({
  id,
  linkType,
  expireDate,
  transactionType,
}) => {
  return apiGet(
    `${INVOICE_GENERATE_LINK}?id=${id}&linkType=${linkType}&expireDate=${expireDate}&transactionType=${transactionType}`,
  );
};

export const DisableInvoiceLink = ({ invoiceId, workspaceId }) => {
  return apiUpdate(`${INVOICE_DISABLE_LINK}`, { invoiceId, workspaceId });
};

export const getSecureInvoiceOverview = (token) => {
  return apiGet(`${INVOICE}/secure/overview`, {
    params: { token },
  });
};

export const sendInvoiceOtp = (data) => {
  return apiPost(`${INVOICE}/secure/send-otp`, data);
};

export const verifyInvoiceOtp = (data) => {
  return apiPost(`${INVOICE}/secure/verify-otp`, data);
};
