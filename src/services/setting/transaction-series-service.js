import { apiGet, apiUpdate } from "../axios-instance";
import { GET_COUNTERS, UPDATE_COUNTERS } from "../endpoints";

export const getAllCounters = () => {
  return apiGet(GET_COUNTERS);
};


export const updateAllCounters = (data) => {
  return apiUpdate(UPDATE_COUNTERS,data);
};
