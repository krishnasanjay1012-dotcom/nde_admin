import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import { GET_INVOICE_COUNTER, PAYMENT_TERM } from "../endpoints";

export const addPaymentTerm = (data) => {
  return apiPost(PAYMENT_TERM, data);
};

export const getAllPaymentTerms = () => {
  return apiGet(PAYMENT_TERM);
};

export const getInvoiceNumber = (type) => {
  return apiGet(`${GET_INVOICE_COUNTER}?filter=${type}`);
};


export const getPaymentTermById = ({ id }) => {
  return apiGet(`${PAYMENT_TERM}/${id}`);
};

export const updatePaymentTerm = ({ id, data }) => {
  return apiUpdate(`${PAYMENT_TERM}/${id}`, data);
};

export const deletePaymentTerm = (id) => {
  return apiDelete(`${PAYMENT_TERM}/${id}`);
};
