import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import { LOGOS_VIEW, LOGOS_CREATE, LOGOS_UPDATE, LOGOS_DELETE } from "../endpoints";

// Fetch all logos
export const getLogos = () => {
  return apiGet(LOGOS_VIEW);
};

// Create a new logo
export const createLogo = (formData) => {
  return apiPost(LOGOS_CREATE, formData);
};

// Update an existing logo (image-only)
export const updateLogo = (formData) => {
  return apiUpdate(LOGOS_UPDATE, formData);
};

// Delete a logo
export const deleteLogo = (id) => {
  return apiDelete(`${LOGOS_DELETE}/${id}`);
};

export const updateClientLogo = (id, formData) => {
  return apiUpdate(`${LOGOS_VIEW}/${id}`,formData);
};