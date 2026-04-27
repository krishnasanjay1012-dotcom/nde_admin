import {
  apiGet,
  apiPost,
  apiUpdate,
  apiDelete,
} from "../axios-instance";
import { CLIENT_NOTES } from "../endpoints";

/* Get all notes by user */
export const getAllNotes = ({ userId }) => {
  return apiGet(`${CLIENT_NOTES}?userId=${userId}`);
};

/* Get note by ID */
export const getNoteById = ({ id }) => {
  return apiGet(`${CLIENT_NOTES}/${id}`);
};

/* Add note */
export const addNote = (data) => {
  return apiPost(CLIENT_NOTES, data);
};

/* Update note */
export const updateNote = ({ id, data }) => {
  return apiUpdate(`${CLIENT_NOTES}/${id}`, data);
};

/* Delete note */
export const deleteNote = ({ id }) => {
  return apiDelete(`${CLIENT_NOTES}/${id}`);
};