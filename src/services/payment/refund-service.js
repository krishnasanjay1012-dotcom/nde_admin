import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { REFUND, REFUND_BY_PAYMENT } from "../endpoints";

export const deleteRefund = (id) => {
  return apiDelete(`${REFUND}/${id}`);
};


export const addRefund = (paymentId, data) => {
  return apiPost(`${REFUND}/${paymentId}`, data);
};


export const getRefundList = ({ id, workspaceId }) => {
  return apiGet(`${REFUND_BY_PAYMENT}?id=${id}&workspaceId=${workspaceId}`);
};


export const getRefundByID = (id) => {
  return apiGet(`${REFUND}/${id}`);
};


export const updateRefund = (id, data) => {
  return apiUpdate(`${REFUND}/${id}`, data);
};

export const updatePayment = (id, data) => {
  return apiUpdate(`/payment/${id}`, data);
};


