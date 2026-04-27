import { apiGet, apiPost, apiPatch, apiDelete } from "../axios-instance";
import {
  PAYMENTS_VIEW,
  PAYMENTS_CREATE,
  PAYMENTS_UPDATE,
  PAYMENTS_DELETE,
  PAYMENT_TYPES
} from "../endpoints";

// Get all payments
export const getPayments = () => {
  return apiGet(PAYMENTS_VIEW);
};

// Create a new payment
export const createPayment = (data) => {
  return apiPost(PAYMENTS_CREATE, data);
};

// Update an existing payment
export const updatePayment = (id, data) => {
  return apiPatch(`${PAYMENTS_UPDATE}/${id}`, data);
};

// Delete a payment
export const deletePayment = (id) => {
  return apiDelete(`${PAYMENTS_DELETE}/${id}`);
};

export const getPaymentTypes = () => {
  return apiGet(PAYMENT_TYPES);
};