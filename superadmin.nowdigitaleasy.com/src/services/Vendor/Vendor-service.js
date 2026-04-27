import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import { ADDRESS, VENDORS, VENDORS_NOTES } from "../endpoints";

export const getVendorCustomView = ({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  type=''
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    start_date,
    end_date,
    sort,
    type,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${VENDORS}?${query.toString()}`);
};


export const getVendorList = ({
  page = 1,
  limit = 10,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  type=''
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    searchTerm,
    start_date,
    end_date,
    sort,
    type,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${VENDORS}?${query.toString()}`);
};



export const getVendorDetails = ({ id }) => {
  return apiGet(`${VENDORS}/${id}`);
};

export const vendorCreate = (data) => {
  return apiPost(VENDORS, data);
};
export const updateVendorById = (vendorId, data) => {
  return apiUpdate(`${VENDORS}/${vendorId}`, data);
};

export const deleteVendor = (vendorId) => {
  return apiDelete(`${VENDORS}/${vendorId}`);
};

export const bulkDeleteVendors = (data) => {
  return apiDelete(VENDORS, data);
};

/* Get all notes by user */
export const getAllNotes = ({ vendorId }) => {
  return apiGet(`${VENDORS_NOTES}?vendorId=${vendorId}`);
};

/* Get note by ID */
export const getNoteById = ({ id }) => {
  return apiGet(`${VENDORS_NOTES}/${id}`);
};

/* Add note */
export const addNote = (data) => {
  return apiPost(VENDORS_NOTES, data);
};

/* Update note */
export const updateNote = ({ id, data }) => {
  return apiUpdate(`${VENDORS_NOTES}/${id}`, data);
};

/* Delete note */
export const deleteNote = ({ id }) => {
  return apiDelete(`${VENDORS_NOTES}/${id}`);
};


export const updateBillingShippingAddress = ({ id, data, entity, type }) => {
  return apiUpdate(`${ADDRESS}/${id}?entity=${entity}&type=${type}`, data);
};
