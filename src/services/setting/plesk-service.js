import { webserviceDelete, webserviceGet, webservicePost, webserviceUpdate } from "../web-service.instonce";
import { PLESK_VIEW, PLESK_CREATE, PLESK_UPDATE, PLESK_DELETE } from "../endpoints";

// Fetch all Plesk items
export const getPlesk = () => {
  return webserviceGet(PLESK_VIEW);
};

// Create a new Plesk item
export const createPlesk = (data) => {
  return webservicePost(PLESK_CREATE, data);
};

// Update an existing Plesk item
export const updatePlesk = (id, data) => {
  return webserviceUpdate(`${PLESK_UPDATE}/${id}`, data);
};

// Delete a Plesk item
export const deletePlesk = (id) => {
  return webserviceDelete(`${PLESK_DELETE}/${id}`);
};
