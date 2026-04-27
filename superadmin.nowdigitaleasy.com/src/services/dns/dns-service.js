import {
  ZONE,
  PREVIEW,
  SWITCH_TEMPLATE,
  SYNC_TEMPLATE,
  PRESET,
  RECORDS,
  FILTER_RECORDS,
  BULK,
  TEMPLATES,
  TOGGLE,
  TEMP_VALUE,
  DOMAIN_DETAILS
} from "../endpoints";
import { dnsPost, dnsDelete, dnsGet, dnsUpdate, dnsPatch } from "../dns-instance";


// export const getAllZone = () => {
//   return dnsGet(APPS_LIST);
// };

export const getDnsZones = async () => {
  return dnsGet(`${ZONE}`);
};

export const createDnsDomain = async (payload) => {
  return dnsPost(`${ZONE}`, payload);
};


export const getZoneRecords = (zoneId, params) => {
  return dnsGet(`${ZONE}/${zoneId}${FILTER_RECORDS}`, { params });
};

export const getOneRecord = (zoneId, recordId) => {
  return dnsGet(`${ZONE}/${zoneId}${RECORDS}/${recordId}`);
};

export const addRecord = (zoneId, payload) => {
  return dnsPost(`${ZONE}/${zoneId}${RECORDS}`, payload);
};

export const addbulkRecord = (zoneId, payload) => {
  return dnsPost(`${ZONE}/${zoneId}${RECORDS}${BULK}`, payload);
}

export const updateRecord = (zoneId, recordId, payload) => {
  return dnsUpdate(`${ZONE}/${zoneId}${RECORDS}/${recordId}`, payload);
};

export const deleteRecord = (zoneId, recordId) => {
  return dnsDelete(`${ZONE}/${zoneId}${RECORDS}/${recordId}`);
};

export const getZonePresets = (zoneId, template_id) => {
  return dnsGet(`${PRESET}?zoneId=${zoneId}&template_id=${template_id}`);
};

export const addPreset = (payload) => {
  return dnsPost(`${PRESET}`, payload);
};

export const updatePreset = (presetId, payload) => {
  return dnsUpdate(`${PRESET}/${presetId}`, payload);
};

export const deletePreset = (presetId) => {
  return dnsDelete(`${PRESET}/${presetId}`);
};

export const getTemplates = async (filters = {}) => {
  return dnsGet(`${TEMPLATES}`, filters);
};

export const getTemplate = async (id) => {
  return dnsGet(`${TEMPLATES}/${id}`);
};

export const createTemplate = async (payload) => {
  return dnsPost(`${TEMPLATES}`, payload);
};

export const updateTemplate = async (id, payload) => {
  return dnsUpdate(`${TEMPLATES}/${id}`, payload);
};

export const deleteTemplate = async (id) => {
  return dnsDelete(`${TEMPLATES}/${id}`);
};

export const toggleTemplateStatus = async (id) => {
  return dnsPatch(`${TEMPLATES}/${id}${TOGGLE}`);
};

export const getTemplateValues = async () => {
  return dnsGet(`${TEMP_VALUE}`);
};

export const createTemplateValue = async (payload) => {
  return dnsPost(`${TEMP_VALUE}`, payload);
};

export const updateTemplateValue = async (id, payload) => {
  return dnsUpdate(`${TEMP_VALUE}/${id}`, payload);
};

export const getTemplateValueById = async (id) => {
  return dnsGet(`${TEMP_VALUE}/${id}`);
};

export const previewZoneTemplate = (payload) => {
  return dnsPost(`${ZONE}${PREVIEW}`, payload);
};

export const switchZoneTemplate = (zoneId, payload) => {
  return dnsPost(`${ZONE}/${zoneId}${SWITCH_TEMPLATE}`, payload);
};

export const getZoneDetails = (zoneId) => {
  return dnsGet(`${ZONE}${DOMAIN_DETAILS}?zone_name=${zoneId}`);
}