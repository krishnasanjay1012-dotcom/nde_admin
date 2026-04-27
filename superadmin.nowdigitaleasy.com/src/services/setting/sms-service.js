import { apiGet, apiPost, apiPatch, apiDelete } from "../axios-instance";
import {
  SMS_CONFIG_VIEW,
  SMS_CONFIG_CREATE,
  SMS_CONFIG_UPDATE,
  SMS_CONFIG_DELETE,
  SMS_CONFIG_ENABLE,
  SMS_TEMPLATE_ALL,
  SMS_TEMPLATE_BY_ID,
  SMS_TEMPLATE_CREATE,
  SMS_TEMPLATE_UPDATE,
  SMS_TEMPLATE_DELETE,
} from "../endpoints";

// SMS Config
export const getSmsConfig = () => apiGet(SMS_CONFIG_VIEW);

export const createSmsConfig = (data) => apiPost(SMS_CONFIG_CREATE, data);

export const updateSmsConfig = (id, data) =>
  apiPatch(`${SMS_CONFIG_UPDATE}/${id}`, data);

export const deleteSmsConfig = (id) =>
  apiDelete(`${SMS_CONFIG_DELETE}/${id}`);

export const enableSmsConfig = (data) => apiPost(SMS_CONFIG_ENABLE, data);

// SMS Templates
export const getAllSmsTemplates = () => apiGet(SMS_TEMPLATE_ALL);

export const getSmsTemplateById = (id) =>
  apiGet(`${SMS_TEMPLATE_BY_ID}/${id}`);

export const createSmsTemplate = (data) => apiPost(SMS_TEMPLATE_CREATE, data);

export const updateSmsTemplate = (id, data) =>
  apiPatch(`${SMS_TEMPLATE_UPDATE}/${id}`, data);

export const deleteSmsTemplate = (id) =>
  apiDelete(`${SMS_TEMPLATE_DELETE}/${id}`);
