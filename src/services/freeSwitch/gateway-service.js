import {
  freeswitchapiDelete,
  freeswitchapiGet,
  freeswitchapiPost,
  freeswitchapiUpdate,
} from "../freeswitch-instance";
import {
  FREESWITCH_GATEWAY_ADD,
  FREESWITCH_GATEWAY_GET,
  FREESWITCH_GATEWAY_UPDATE,
  FREESWITCH_GATEWAY_DELETE,
} from "../endpoints";

export const getGateways = () => {
  return freeswitchapiGet(FREESWITCH_GATEWAY_GET);
};

export const addGateway = (data) => {
  return freeswitchapiPost(FREESWITCH_GATEWAY_ADD, data);
};

export const updateGateway = (id, data) => {
  return freeswitchapiUpdate(`${FREESWITCH_GATEWAY_UPDATE}${id}`, data);
};

export const deleteGateway = (id) => {
  return freeswitchapiDelete(`${FREESWITCH_GATEWAY_DELETE}${id}`);
};
