import { apiDelete, apiGet, apiPost, apiUpdate } from "../axios-instance";
import {
  TAX_VIEW,
  TAX_EXCEL,
  TAX_PDF,
  GST_TAX_CREATE_AND_LIST,
} from "../endpoints";

export const getTaxes = ({
  page = 1,
  limit = 10,
  date_filter,
  start_date,
  end_date,
}) => {
  return apiGet(
    `${TAX_VIEW}?page=${page || 1}&limit=${limit || 10}&date_filter=${date_filter || ""}&start_date=${start_date || ""}&end_date=${end_date || ""}`,
  );
};

export const getTaxesPdf = (pdfUrl) => {
  return apiGet(`${TAX_PDF}/${pdfUrl}`);
};

export const getTaxesExcel = () => {
  return apiGet(TAX_EXCEL);
};

export const createTax = (data) => {
  return apiPost(GST_TAX_CREATE_AND_LIST, data);
};

export const getGstTaxList = () => {
  return apiGet(GST_TAX_CREATE_AND_LIST);
};

export const deleteGstTax = (id) => {
  return apiDelete(`${GST_TAX_CREATE_AND_LIST}/${id}`);
};

export const updateGstTax = (id, data) => {
  return apiUpdate(`${GST_TAX_CREATE_AND_LIST}/${id}`, data);
};
