import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import { IMP_LINKS_VIEW, IMP_LINKS_CREATE, IMP_LINKS_UPDATE, IMP_LINKS_DELETE } from "../endpoints";

// Fetch all important links
export const getImpLinks = () => {
  return apiGet(IMP_LINKS_VIEW);
};

// Create a new link
export const createImpLink = (data) => {
  return apiPost(IMP_LINKS_CREATE, data);
};

// Update an existing link
export const updateImpLink = (id, data) => {
  return apiUpdate(`${IMP_LINKS_UPDATE}/${id}`, data);
};

// Delete a link
export const deleteImpLink = (id) => {
  return apiDelete(`${IMP_LINKS_DELETE}/${id}`);
};
