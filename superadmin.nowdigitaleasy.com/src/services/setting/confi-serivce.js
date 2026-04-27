import { apiGet, apiUpdate } from "../axios-instance";
import {CONFIG_VIEW,CONFIG_UPDATE, GSUITE_OAUTH_ACTIVE_CONFIG,} from "../endpoints";
import {  webserviceGet } from "../web-service.instonce";


export const getConfigSettings = () => {
  return apiGet(CONFIG_VIEW);
};

export const updateConfigSettings = (data) => {
  return apiUpdate(CONFIG_UPDATE, data);
};

export const getGSuiteOAuthActiveConfig = () => {
  return webserviceGet(GSUITE_OAUTH_ACTIVE_CONFIG);
};
