import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import { APP_DETAILS } from "../endpoints";

export const addAppDetails = (data) => {
  return apiPost(APP_DETAILS, data);
};

export const getAllAppDetails = () => {
  return apiGet(APP_DETAILS);
};

export const getAppDetailsByName = (appName) => {
  return apiGet(`${APP_DETAILS}/${appName}`);
};

export const updateAppDetails = (data) => {
  return apiUpdate(APP_DETAILS, data);
};

export const deleteAppDetails = (id) => {
  return apiDelete(`${APP_DETAILS}/${id}`);
};
