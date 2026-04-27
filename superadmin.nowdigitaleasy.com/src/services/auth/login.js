import { apiPost,apiGet, apiUpdate, apiDelete } from "../axios-instance";
import {LOGIN_URL,GLOBALSEARCH, ADMIN_LIST, ADMIN_SIGNUP, UPDATE_ADMIN, DELETE_ADMIN, ADMIN_CUSTOMERS, ADMIN_BY_ID, VIEW_PREFERENCE } from "../endpoints";

export const login = (data) => {
  return apiPost(`${LOGIN_URL}`, data);
};
export const getGlobalSearch  = ({searchValue, category}) => {
  return apiGet(`${GLOBALSEARCH}?searchParams=${searchValue}&category=${category}`);
};

export const getAdminList = () => {
  return apiGet(ADMIN_LIST);
};

export const updateAdmin = (data) => {
  return apiUpdate(UPDATE_ADMIN, data);
};

export const adminSignUp = (data) => {
  return apiPost(ADMIN_SIGNUP, data);
};

export const deleteAdmin = (deleteId) => {
  return apiDelete(`${DELETE_ADMIN}/${deleteId}`);
};

export const getAdminCustomers = (adminId) => {
  return apiGet(`${ADMIN_CUSTOMERS}/${adminId}`);
};

export const getAdminDetailsById = ({ id }) => {
  return apiGet(`${ADMIN_BY_ID}/${id}`);
};

export const updateViewPreference = (data) => {
  return apiUpdate(VIEW_PREFERENCE, data);
};