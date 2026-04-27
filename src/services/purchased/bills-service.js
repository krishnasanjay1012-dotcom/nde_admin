import { apiDelete, apiGet, apiPatch, apiPost, apiUpdate } from "../axios-instance";
import { BILL_CALENDAR_VIEW, BILL_PAYMENTS, BILL_PAYMENTS_BY_BILL, BILLS, VENDOR_BILL_OPEN, VENDOR_BILL_UNPAID, VENDOR_BILL_UNVOID, VENDOR_BILL_VOID } from "../endpoints";

export const getBillsCustomView = ({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  sort = "",
  customFilters = [],
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    sort,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${BILLS}?${query.toString()}`);
};

export const getBillsDetails = ({ id }) => {
  return apiGet(`${BILLS}/${id}`);
};

export const billCreate = (data) => {
  return apiPost(BILLS, data);
};
export const updateBillById = (billId, data) => {
  return apiUpdate(`${BILLS}/${billId}`, data);
};

export const deleteBills = (billId) => {
  return apiDelete(`${BILLS}/${billId}`);
};

export const bulkDeleteBills = (data) => {
  return apiDelete(BILLS, data);
};

export const getBillPaymentsByBillId = ({ id }) => {
  return apiGet(`${BILL_PAYMENTS_BY_BILL}/${id}`);
};

export const getBillCalendarView = ({
  entity = "bill",
  month,
  year,
  filter,
  currency,
}) => {
  return apiGet(
    `${BILL_CALENDAR_VIEW}?entity=${entity}&month=${month}&year=${year}&filter=${filter}&currency=${currency}`
  );
};

// Void
export const voidBill = (data) => {
  return apiPatch(VENDOR_BILL_VOID, data);
};

/* Unvoid Bill */
export const unvoidBill = (data) => {
  return apiPatch(VENDOR_BILL_UNVOID, data);
};

// Payment
export const createBillPayment = (data) => {
  return apiPost(BILL_PAYMENTS, data);
};

export const getBillPaymentById = ({ id }) => {
  return apiGet(`${BILL_PAYMENTS}/${id}`);
};

export const updateBillPaymentById = (id, data) => {
  return apiUpdate(`${BILL_PAYMENTS}/${id}`, data);
};

export const deleteBillPayment = (id) => {
  return apiDelete(`${BILL_PAYMENTS}/${id}`);
};

export const openBill = (id) => {
  return apiPatch(`${VENDOR_BILL_OPEN}/${id}/open`);
};

export const updateBillPayment = (data) => {
  return apiUpdate(`${BILL_PAYMENTS}/`, data);
};

export const getUnpaidBillsByVendor = ({ vendorId }) => {
  return apiGet(`${VENDOR_BILL_UNPAID}/${vendorId}`);
};

