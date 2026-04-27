import { apiGet, apiPost, apiUpdate, apiDelete, apiPatch } from "../axios-instance";
import {
  BILLING_CYCLE,
  PLAN_BASE,
  PLAN_BILLING_CYCLE,
  PLAN_CLONE,
  PLAN_CONFIG,
  PLAN_PRICE_DISCOUNT,
  PLAN_PRICING,
  PLAN_PRICING_CURRENCY,
  PLAN_REMOVE_PROFILE,
  PLAN_UPLOAD_PROFILE,
  PRODUCT,
  PRODUCT_EXIST,
  PRODUCT_STATUS,
  PRODUCT_SUGGESTION,
  TAX,
  TAXBYID,
} from "../endpoints";

export const createProduct = (formData) => {
  return apiPost(PRODUCT, formData);
};

export const getAllProducts = ({ type = "", page, limit, search, customFilters, filter }) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    type,
    search,
    customFilters: JSON.stringify(customFilters),
  });
  return apiGet(
    `${PRODUCT}?${query.toString()}`,
  );
};

export const getTaxList = ({ taxType }) => {
  return apiGet(`${TAX}?taxType=${taxType}`);
};
export const getProductById = (id) => {
  return apiGet(`${PRODUCT}/${id}`);
};

export const getTaxesById = (id) => {
  return apiGet(`${TAXBYID}/${id}`);
};

export const updateProduct = (id, formData) => {
  return apiUpdate(`${PRODUCT}/${id}`, formData);
};

export const deleteProduct = (id) => {
  return apiDelete(`${PRODUCT}/${id}`);
};

// Product Plan

export const addPlan = (data) => {
  return apiPost(PLAN_BASE, data);
};

export const clonePlan = ({ planId, data }) => {
  return apiPost(`${PLAN_CLONE}/${planId}`, data);
};

export const getPlanConfigById = (planId) => {
  return apiGet(`${PLAN_CONFIG}/${planId}`);
};

export const getAllPlans = (type, productId) => {
  return apiGet(`${PLAN_BASE}?type=${type}&product_id=${productId}`);
};

export const getPlanById = (planId) => {
  return apiGet(`${PLAN_BASE}/${planId}`);
};
export const updatePlan = (id, data) => {
  return apiUpdate(`${PLAN_BASE}/${id}`, data);
};

export const deletePlan = (id) => {
  return apiDelete(`${PLAN_BASE}/${id}`);
};

export const getPlanPricings = (planId) => {
  return apiGet(`${PLAN_PRICING}/${planId}`);
};

export const updatePlanPricing = (data) => {
  return apiPost(PLAN_PRICING_CURRENCY, data);
};

export const updateProductStatus = (data) => {
  return apiUpdate(PRODUCT_STATUS, data);
};
export const getPlanBillingCycles = (type) => {
  return apiGet(`${PLAN_BILLING_CYCLE}?type=${type}`);
};

export const getBillingCycles = ({ plan_id, currency_id }) => {
  return apiGet(`${BILLING_CYCLE}/${plan_id}/${currency_id}`);
};

export const getPlanPriceDiscount = ({ plan_id, currency_id, billing }) => {
  return apiGet(`${PLAN_PRICE_DISCOUNT}/${plan_id}/${currency_id}/${billing}`);
};

export const updatePlanPriceDiscount = (data) => {
  return apiUpdate(PLAN_PRICE_DISCOUNT, data);
};

// upload profile
export const uploadPlanProfile = ({ planId, data }) => {
  return apiPost(`${PLAN_UPLOAD_PROFILE}/${planId}`, data);
};

// remove profile
export const removePlanProfile = (planId) => {
  return apiDelete(`${PLAN_REMOVE_PROFILE}/${planId}`);
};

export const updateHostingConfig = ({ planId, data }) => {
  return apiUpdate(`${PLAN_CONFIG}/${planId}`, data);
};

// Pricing variants for invoice line items
export const getPriceVariants = (currencyId) => {
  return apiGet(`/plan/price-varients?currencyId=${currencyId}`);
};


export const getProductExists = (type) => {
  return apiGet(`${PRODUCT_EXIST}?type=${type}`);
};


//product-suggestion


export const getProductSuggestionList = () => {
  return apiGet(PRODUCT_SUGGESTION);
};

export const updateProductSuggestion = (productId, formData,suggestionId) => {
  return apiUpdate(`${PRODUCT_SUGGESTION}/${productId}/${suggestionId}`, formData);
};

export const deleteProductSuggestion = ({ productId, suggestionId }) => {
  return apiDelete(
    `${PRODUCT_SUGGESTION}/${productId}/${suggestionId}`
  );
};

export const createProductSuggestion = (formData) => {
  return apiPost(PRODUCT_SUGGESTION, formData);
};

export const updateProductSuggestionStatus = ({ id, data,suggestionId }) => {
  return apiPatch(`${PRODUCT_SUGGESTION}/${id}/${suggestionId}/status`, data);
};