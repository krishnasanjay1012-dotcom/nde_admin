import { apiDelete, apiGet, apiPatch, apiPost, apiUpdate } from "../axios-instance";
import { ITEMS, ITEMS_NOTES, TAX_HSN_SEARCH } from "../endpoints";


export const getItemCustomView = ({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  sort = "",
  customFilters = [],
}) => {
  const query = new URLSearchParams({
    page,
    limit,
    filter,
    searchTerm,
    sort,
    customFilters: JSON.stringify(customFilters),
  });

  return apiGet(`${ITEMS}?${query.toString()}`);
};

export const getItemDetails = ({ id }) => {
  return apiGet(`${ITEMS}/${id}`);
};


export const itemCreate = (data) => {
  return apiPost(ITEMS, data);
};


export const updateItemById = (itemId, data) => {
  return apiUpdate(`${ITEMS}/${itemId}`, data);
};

export const deleteItem = (itemId) => {
  return apiDelete(`${ITEMS}/${itemId}`);
};


export const bulkDeleteItems = (data) => {
  return apiDelete(ITEMS, data);
};



/* Get all notes */
export const getAllNotes = ({ itemId }) => {
  return apiGet(`${ITEMS_NOTES}?itemId=${itemId}`);
};

/* Get note by ID */
export const getNoteById = ({ id }) => {
  return apiGet(`${ITEMS_NOTES}/${id}`);
};

/* Add note */
export const addNote = (data) => {
  return apiPost(ITEMS_NOTES, data);
};

/* Update note */
export const updateNote = ({ id, data }) => {
  return apiUpdate(`${ITEMS_NOTES}/${id}`, data);
};

/* Delete note */
export const deleteNote = ({ id }) => {
  return apiDelete(`${ITEMS_NOTES}/${id}`);
};


export const uploadItemLogo = ({ id, data }) => {
  return apiPatch(`${ITEMS}/${id}/logo`, data);
};

export const removeItemLogo = ({ id }) => {
  return apiDelete(`${ITEMS}/${id}/logo`);
};


export const searchHSNCode = ({
  searchText = "",
  isService = false,
  country = "india",
}) => {
  return apiGet(
    `${TAX_HSN_SEARCH}?searchText=${searchText}&isService=${isService}&country=${country}`
  );
};