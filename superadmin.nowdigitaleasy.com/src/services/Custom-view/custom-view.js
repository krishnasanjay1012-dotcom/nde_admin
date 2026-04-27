import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { AVAILABLE_FIELDS, CUSTOM_VIEW_FAVORITE, CUSTOM_VIEWS, CUSTOM_VIEWS_CUSTOMER, FILTER_FIELDS, FILTER_OPTIONS_CUSTOMER } from "../endpoints";

export const updateCustomViewFavorite = ({ module, viewId }) => {
  return apiUpdate(
    `${CUSTOM_VIEW_FAVORITE}/${module}/${viewId}/favorite`
  );
};

export const getCustomerFilterOptions = (module) => {
  return apiGet(`${FILTER_OPTIONS_CUSTOMER}/${module}`);
};

export const getAvailableFields = (module) => {
  return apiGet(`${AVAILABLE_FIELDS}/${module}`);
};

export const getFilterFields = (module) => {
  return apiGet(`${FILTER_FIELDS}/${module}`);
};

export const createCustomerCustomView = ({data,module}) => {
  return apiPost(`${CUSTOM_VIEWS_CUSTOMER}/${module}`, data);
};

export const updateCustomView = ({ module, viewID, data }) => {
  return apiUpdate(`${CUSTOM_VIEWS}/${module}/${viewID}`, data);
};

export const deleteCustomView = ({ module, viewID }) => {
  return apiDelete(`${CUSTOM_VIEWS}/${module}/${viewID}`);
};

export const getCustomViewById = ({ module, viewId }) => {
  return apiGet(`${CUSTOM_VIEWS}/${module}/${viewId}`);
};

