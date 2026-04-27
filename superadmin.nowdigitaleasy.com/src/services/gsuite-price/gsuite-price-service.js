import { apiGet } from "../axios-instance";
import {
  GSUITE_PRICE_VIEW,
  GSUITE_PRICE_CREATE,
  GSUITE_PRICE_UPDATE,
  GSUITE_PRICE_DELETE,
  MASTER_VIEW, PRODUCT_VIEW,
  GSUITE_VIEW_ID
} from "../endpoints";
import { webserviceGet , webserviceDelete,  webservicePost, webserviceUpdate } from "../web-service.instonce";


// Fetch all GSuite prices
export const getGSuitePrices = () => {
  return webserviceGet(GSUITE_PRICE_VIEW);
};
export const getGSuiteById = (id) => {
  return webserviceGet(`${GSUITE_VIEW_ID}/${id}`);
};

// Create a new GSuite price
export const createGSuitePrice = (data) => {
  return webservicePost(GSUITE_PRICE_CREATE, data);
};

// Update an existing GSuite price
export const updateGSuitePrice = (data) => {
  return webserviceUpdate(GSUITE_PRICE_UPDATE, data);
};

// Delete a GSuite price
export const deleteGSuitePrice = (id) => {
  return webserviceDelete(`${GSUITE_PRICE_DELETE}/${id}`);
};


export const getMasters = () => {
  return webserviceGet(MASTER_VIEW);
};

// Fetch all product records
export const getProducts = () => {
  return apiGet(PRODUCT_VIEW);
};
