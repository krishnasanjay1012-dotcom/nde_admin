import { apiGet, apiPost, apiUpdate, apiDelete, apiPatch } from "../axios-instance";
import { EMAIL_VIEW, EMAIL_CREATE, EMAIL_UPDATE,EMAIL_ALL_TEMPLATE, EMAIL_CAMPAIGN_NAME,EMAIL_DELETE,EMAIL_ENABLE,BULK_MAIL,EMAIL_GET_CONFIG,EMAIL_GROUP,EMAIL_NEWSLETTER_SEND, EMAIL_UPDATE_TEMPLATE, EMAIL_TEMPLATE_BY_ID, EMAIL_ADD_TEMPLATE} from "../endpoints";

// Fetch all emails
export const getEmails = () => {
  return apiGet(EMAIL_VIEW);
};

// Create a new email
export const createEmail = (data) => {
  return apiPost(EMAIL_CREATE, data);
};

// Update an existing email
export const updateEmail = (id, data) => {
  return apiPatch(`${EMAIL_UPDATE}/${id}`, data);
};

// Delete an email
export const deleteEmail = (id) => {
  return apiDelete(`${EMAIL_DELETE}/${id}`);
};


export const enableEmail = (data) => {
  return apiUpdate(EMAIL_ENABLE, data); // data can be { id: emailId } or any payload required
};

export const getBulkMail = ({ page = 1, limit = 10, campaignId = "", filter = "all" }) => {
  const query = new URLSearchParams({
    page,
    limit,
    campaignId,
    filter,
  }).toString();
  return apiGet(`${BULK_MAIL}?${query}`);
};


// Get Email Config
export const getEmailConfig = () => {
  return apiGet(EMAIL_GET_CONFIG);
};

// Get Email Groups
export const getEmailGroups = () => {
  return apiGet(EMAIL_GROUP);
};

export const sendNewsletter = (data) => {
  return apiPost(EMAIL_NEWSLETTER_SEND, data);
};

// Get all email campaign names
export const getEmailCampaignNames = () => {
  return apiGet(EMAIL_CAMPAIGN_NAME);
};

// Get all email templates
export const getAllEmailTemplates = () => {
  return apiGet(EMAIL_ALL_TEMPLATE);
};

export const getEmailTemplateById = (templateId) => {
  return apiGet(`${EMAIL_TEMPLATE_BY_ID}/${templateId}`);
};

export const updateEmailTemplate = (data) => {
  return apiPatch(EMAIL_UPDATE_TEMPLATE, data);
};

export const addEmailTemplate = (data) => {
  return apiPost(EMAIL_ADD_TEMPLATE, data);
};