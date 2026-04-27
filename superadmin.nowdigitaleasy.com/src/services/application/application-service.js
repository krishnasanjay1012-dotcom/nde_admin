import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { APPS, APPS_LIST, APPS_PRICE, APPS_PRODUCT, APPS_UPDATE,APPS_PLAN, ADD_EDIT_PLAN, APPS_PLAN_DELETE, APPS_DELETE, SUITE_ADD, SUITE_DELETE, SUITE_GET_ALL, SUITE_UPDATE,SUITE_PLAN_DELETE, SUITE_PLAN_CREATE, SUITE_PLAN_BY_ID, SUITE_PLAN_UPDATE } from "../endpoints";

export const createApp = (data) => {
  return apiPost(APPS, data);
};

export const getApps = () => {
  return apiGet(APPS_LIST);
};

export const getAppProducts = ({isAscending,searchTerm}) => {
  return apiGet(`${APPS_PRODUCT}?isAscending=${isAscending}&searchTerm=${searchTerm || ''}`);
};
export const updateAppById = (appId, data) => {
  return apiUpdate(`${APPS_UPDATE}/${appId}`, data);
};
export const getAppPrice = ({ plan, product }) => {
  return apiGet(`${APPS_PRICE}?plan=${plan}&product=${product}`);
};

export const updatePlanPrice = (data) => {
  return apiUpdate(APPS_PRICE, data);
};

export const getPlansByProductId = (productId) => {
  return apiGet(`${APPS_PLAN}/${productId}`);
};

export const createPlan = (data) => {
  return apiPost(ADD_EDIT_PLAN, data);
};

export const updatePlan = (data) => {
  return apiUpdate(ADD_EDIT_PLAN, data);
};

export const deleteAppProduct = (productId) => {
  return apiDelete(`${APPS_PLAN_DELETE}/${productId}`);
};

export const bulkDeleteApps = (ids) => {
  return apiDelete(APPS_DELETE, { products: ids });
};

export const deleteApp = (id) => {
  return apiDelete(`${APPS_PRODUCT}/${id}`);
};

// Suite

export const addSuite = (data) => {
  return apiPost(SUITE_ADD, data);
};

export const deleteSuite = (id) => {
  return apiDelete(`${SUITE_DELETE}/${id}`);
};

export const getAllSuites = () => {
  return apiGet(SUITE_GET_ALL);
};

export const updateSuite = (id, data) => {
  return apiUpdate(`${SUITE_UPDATE}/${id}`, data);
};

export const deleteSuitePlan = (id) => {
  return apiDelete(`${SUITE_PLAN_DELETE}/${id}`);
};

export const createSuitePlan = (data) => {
  return apiPost(SUITE_PLAN_CREATE, data);
};

export const getSuitePlanById = (id) => {
  return apiGet(`${SUITE_PLAN_BY_ID}/${id}`);
};

export const updateSuitePlan = (id, data) => {
  return apiUpdate(`${SUITE_PLAN_UPDATE}/${id}`, data);
};