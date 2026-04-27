import { apiGet, apiPost } from "../axios-instance";
import { DOMAIN_RENEWAL_PRICE_ADMIN, PAYMENT_GSUITE_RENEWAL, PAYMENT_PLESK_RENEWAL, PRODUCT_GSUITE_PAYMENT, PRODUCT_PLESK_RENEWAL, RAZORPAY_DOMAIN_RENEWAL } from "../endpoints";
import { webserviceGet } from "../web-service.instonce";


export const getDomainRenewalPriceAdmin = (productId, userId) => {
  return apiGet(`${DOMAIN_RENEWAL_PRICE_ADMIN}/${productId}/${userId}`);
};

export const paymentGsuiteProduct = ({ id, userId }) => {
  return webserviceGet(`${PRODUCT_GSUITE_PAYMENT}?id=${id}&userId=${userId}`);
};

export const renewalPleskProduct = ({ id, userId }) => {
  return webserviceGet(`${PRODUCT_PLESK_RENEWAL}?id=${id}&userId=${userId}`);
};

export const payDomainRenewal = (data) => {
  return apiPost(RAZORPAY_DOMAIN_RENEWAL, data);
};

export const renewGsuitePayment = (data) => {
  return apiPost(PAYMENT_GSUITE_RENEWAL, data);
};

export const renewPleskPayment = (data) => {
  return apiPost(PAYMENT_PLESK_RENEWAL, data);
};