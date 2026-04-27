import { freeswitchapiDelete, freeswitchapiGet, freeswitchapiPost, freeswitchapiUpdate} from "../freeswitch-instance";
import { FREESWITCH, FREESWITCH_CONNECT, FREESWITCH_DELETE, FREESWITCH_UPDATE } from "../endpoints";

export const getFreeSwitchData = () => {
  return freeswitchapiGet(FREESWITCH);
};

export const connectFreeSwitch = (data) => {
  return freeswitchapiPost(FREESWITCH_CONNECT, data);
};

export const updateFreeSwitch = (id, data) => {
  return freeswitchapiUpdate(`${FREESWITCH_UPDATE}${id}`, data);
};

export const deleteFreeSwitch = (id) => {
  return freeswitchapiDelete(`${FREESWITCH_DELETE}${id}`);
};
