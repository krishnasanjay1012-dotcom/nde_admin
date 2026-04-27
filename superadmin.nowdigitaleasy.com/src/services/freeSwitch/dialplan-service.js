import {
  freeswitchapiDelete,
  freeswitchapiGet,
  freeswitchapiPost,
  freeswitchapiUpdate,
} from "../freeswitch-instance";
import {
  DIALPLAN_DESTINATION_ADD,
  DIALPLAN_DESTINATION_GET,
  DIALPLAN_DESTINATION_UPDATE,
  DIALPLAN_DESTINATION_DELETE,
} from "../endpoints";

export const getDialPlans = () => {
  return freeswitchapiGet(DIALPLAN_DESTINATION_GET);
};

export const addDialPlan = (data) => {
  return freeswitchapiPost(DIALPLAN_DESTINATION_ADD, data);
};

export const updateDialPlan = (id, data) => {
  return freeswitchapiUpdate(`${DIALPLAN_DESTINATION_UPDATE}${id}`, data);
};

export const deleteDialPlan = (id) => {
  return freeswitchapiDelete(`${DIALPLAN_DESTINATION_DELETE}${id}`);
};

