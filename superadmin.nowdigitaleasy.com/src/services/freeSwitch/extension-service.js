import {
  freeswitchapiDelete,
  freeswitchapiGet,
  freeswitchapiPost,
  freeswitchapiUpdate,
} from "../freeswitch-instance";
import {
  GET_WORKSPACE_DOMAINS,
  EXTENSION_ADD,
  EXTENSION_GET,
  EXTENSION_UPDATE,
  EXTENSION_DELETE,
} from "../endpoints";

export const getWorkspaceDomains = (id) => {
  return freeswitchapiGet(`${GET_WORKSPACE_DOMAINS}${id}`);
};

export const getExtensions = () => {
  return freeswitchapiGet(EXTENSION_GET);
};

export const addExtension = (data) => {
  return freeswitchapiPost(EXTENSION_ADD, data);
};

export const updateExtension = (id, data) => {
  return freeswitchapiUpdate(`${EXTENSION_UPDATE}${id}`, data);
};

export const deleteExtension = (id) => {
  return freeswitchapiDelete(`${EXTENSION_DELETE}${id}`);
};
