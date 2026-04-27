import { apiGet, apiPost, apiUpdate, apiDelete } from "../axios-instance";
import { TAGS_VIEW, TAGS_CREATE, TAGS_UPDATE, TAGS_DELETE } from "../endpoints";

export const getTags = () => {
  return apiGet(TAGS_VIEW);
};

export const createTag = (data) => {
  return apiPost(TAGS_CREATE, data);
};
export const updateTag = (id,data) => {
  return apiUpdate( `${TAGS_UPDATE}/${id}`, data);
};

export const deleteTag = (id) => {
  return apiDelete(`${TAGS_DELETE}/${id}`);
};