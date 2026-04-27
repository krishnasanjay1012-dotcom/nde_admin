import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import { RECAPTCHA } from "../endpoints";

// Add recaptcha
export const addRecaptcha = (data) => {
  return apiPost(RECAPTCHA, data);
};

// Get all recaptcha
export const getAllRecaptcha = () => {
  return apiGet(RECAPTCHA);
};

// Update recaptcha status
export const updateRecaptchaStatus = (id, status) => {
  return apiUpdate(`${RECAPTCHA}/${id}`, { status });
};

// Delete recaptcha
export const deleteRecaptcha = (id) => {
  return apiDelete(`${RECAPTCHA}/${id}`);
};
