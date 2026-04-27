import {
  freeswitchapiDelete,
  freeswitchapiGet,
  freeswitchapiPost,
  freeswitchapiUpdate,
} from "../freeswitch-instance";
import {
  FREESWITCH_DOMAIN_ADD,
  FREESWITCH_DOMAIN_GET,
  FREESWITCH_DOMAIN_SINGLE,
  FREESWITCH_DOMAIN_UPDATE,
  FREESWITCH_DOMAIN_DELETE,
  FREESWITCH_DOMAIN_CHECK,
} from "../endpoints";

export const getFreeSwitchDomains = () => {
  return freeswitchapiGet(FREESWITCH_DOMAIN_GET);
};

export const getFreeSwitchDomainById = (id) => {
  return freeswitchapiGet(`${FREESWITCH_DOMAIN_SINGLE}${id}`);
};

export const addFreeSwitchDomain = (data) => {
  return freeswitchapiPost(FREESWITCH_DOMAIN_ADD, data);
};

export const updateFreeSwitchDomain = (id, data) => {
  return freeswitchapiUpdate(`${FREESWITCH_DOMAIN_UPDATE}${id}`, data);
};

export const deleteFreeSwitchDomain = (id) => {
  return freeswitchapiDelete(`${FREESWITCH_DOMAIN_DELETE}${id}`);
};

export const checkFreeSwitchDomain = (domain) => {
  return freeswitchapiGet(FREESWITCH_DOMAIN_CHECK, { domain });
};
