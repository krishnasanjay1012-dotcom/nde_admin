import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { PAYMENT_MADE, BILL_PAYMENTS } from "../endpoints";

export const getPaymentMadeCustomView = ({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  type=''
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    start_date,
    end_date,
    sort,
    type,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${PAYMENT_MADE}?${query.toString()}`);
};


export const getPaymentMadeList = ({
  page = 1,
  limit = 10,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  type=''
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    searchTerm,
    start_date,
    end_date,
    sort,
    type,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${PAYMENT_MADE}?${query.toString()}`);
};



export const getPaymentMadeDetails = ({ id }) => {
  return apiGet(`${PAYMENT_MADE}/${id}`);
};

export const paymentMadeCreate = (data) => {
  return apiPost(PAYMENT_MADE, data);
};
export const updatePaymentMadeById = (vendorId, data) => {
  return apiUpdate(`${PAYMENT_MADE}/${vendorId}`, data);
};

export const deletePaymentMade = (vendorId) => {
  return apiDelete(`${PAYMENT_MADE}/${vendorId}`);
};

export const bulkDeletePaymentMade = (data) => {
  return apiDelete(PAYMENT_MADE, data);
};

export const update_payment_made = (id, data) => {
  const url = id ? `${BILL_PAYMENTS}/${id}` : `${BILL_PAYMENTS}/`;
  return apiUpdate(url, data);
};
