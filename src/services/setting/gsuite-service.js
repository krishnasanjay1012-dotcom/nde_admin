import { webserviceDelete, webserviceGet, webservicePost, webserviceUpdate } from "../web-service.instonce";
import { GSUITE_VIEW, GSUITE_CREATE, GSUITE_UPDATE, GSUITE_DELETE ,GSUITE_SERVER_UPDATE, GSUITE_DEFAULT_CONFIG, GSUITE_CONFIGURE_GOOGLE, GSUITE_UPDATE_CURRENCY, S3_CONFIG} from "../endpoints";
import { apiGet, apiUpdate } from "../axios-instance";

// Fetch all G-Suite items
export const getGSuite = () => {
  return webserviceGet(GSUITE_VIEW);
};

// Create a new G-Suite item
export const createGSuite = (data) => {
  return webservicePost(GSUITE_CREATE, data);
};

// Update an existing G-Suite item
export const updateGSuite = (id, data) => {
  return webserviceUpdate(`${GSUITE_UPDATE}/${id}`, data);
};

// Delete a G-Suite item
export const deleteGSuite = (id) => {
  return webserviceDelete(`${GSUITE_DELETE}/${id}`);
};

export const updateGSuiteServer = (clientId) => {
  return webserviceUpdate( `${GSUITE_SERVER_UPDATE}?clientId=${clientId}`);
};


export const makeGSuiteDefaultConfig = ({ id, enable }) => {
  return webserviceUpdate(GSUITE_DEFAULT_CONFIG, { id, enable });
};

export const makeGSuiteOAuth = (data) => {
  return webservicePost(GSUITE_CONFIGURE_GOOGLE, data);
};

export const updateGSuiteCurrency = (data) => {
  return webserviceUpdate(GSUITE_UPDATE_CURRENCY, data);
};

export const getS3Configs = () => {
  return apiGet(S3_CONFIG);
};

export const updateS3Config = (id, data) => {
  return apiUpdate(`${S3_CONFIG}/${id}`, data);
};