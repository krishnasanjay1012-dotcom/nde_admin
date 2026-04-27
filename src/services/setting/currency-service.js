import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import {
  CURRENCIES_VIEW,
  CURRENCIES_CREATE,
  CURRENCIES_UPDATE,
  CURRENCIES_DELETE,
} from "../endpoints";

// Fetch all currencies
export const getCurrencies = () => {
  return apiGet(CURRENCIES_VIEW);
};

// Create a new currency
export const createCurrency = (data) => {
  return apiPost(CURRENCIES_CREATE, data);
};

// Update an existing currency
export const updateCurrency = (id, data) => {
  return apiUpdate(`${CURRENCIES_UPDATE}/${id}`, data);
};

// Delete a currency
export const deleteCurrency = (id) => {
  return apiDelete(`${CURRENCIES_DELETE}/${id}`);
};

export const getCurrencyByCode = (code) => {
  return apiGet(`/currency/country-code/${code}`);
};
