import { RESELLER_VIEW, RESELLER_CREATE, RESELLER_UPDATE, RESELLER_DELETE, TLD_BASE } from "../endpoints";
import { webserviceDelete, webserviceGet, webservicePost, webserviceUpdate } from "../web-service.instonce";
import { apiGet } from './../axios-instance';

// Fetch all resellers
export const getResellers = () => {
  return webserviceGet(RESELLER_VIEW);
};

// Create a new reseller
export const createReseller = (data) => {
  return webservicePost(RESELLER_CREATE, data);
};

// Update an existing reseller
export const updateReseller = (id, data) => {
  return webserviceUpdate(`${RESELLER_UPDATE}/${id}`, data);
};

// Delete a reseller
export const deleteReseller = (id) => {
  return webserviceDelete(`${RESELLER_DELETE}/${id}`);
};

export const getTlds = () => {
  return apiGet(TLD_BASE);
};
