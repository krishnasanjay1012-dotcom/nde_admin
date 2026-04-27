import {
    freeswitchapiDelete,
    freeswitchapiGet,
    freeswitchapiPost,
    freeswitchapiUpdate,
} from "../freeswitch-instance";

import {
    FREESWITCH_GROUP_ADD,
    FREESWITCH_GROUP_GET,
    FREESWITCH_GROUP_UPDATE,
    FREESWITCH_GROUP_DELETE,
    GET_WORKSPACE_USERS_DOMAIN,
    GET_DOMAIN_USERS,
    CALLGROUP_ADD,
    CALLGROUP_GET,
    CALLGROUP_UPDATE,
    CALLGROUP_DELETE,
} from "../endpoints";

export const addFreeSwitchGroup = (data) => {
    return freeswitchapiPost(FREESWITCH_GROUP_ADD, data);
};

export const getFreeSwitchGroup = () => {
    return freeswitchapiGet(FREESWITCH_GROUP_GET);
};

export const updateFreeSwitchGroup = (id, data) => {
    return freeswitchapiUpdate(`${FREESWITCH_GROUP_UPDATE}${id}`, data);
};

export const deleteFreeSwitchGroup = (id) => {
    return freeswitchapiDelete(`${FREESWITCH_GROUP_DELETE}${id}`);
};

export const getWorkspaceUsersDomain = (workspaceId) => {
    return freeswitchapiGet(GET_WORKSPACE_USERS_DOMAIN.replace(":workspaceid", workspaceId));
};

export const getDomainUsers = (workspaceId, domainId) => {
    return freeswitchapiGet(GET_DOMAIN_USERS.replace(":workspaceid", workspaceId).replace(":domainid", domainId));
};

export const addCallGroup = (data) => {
    return freeswitchapiPost(CALLGROUP_ADD, data);
};

export const getCallGroup = () => {
    return freeswitchapiGet(CALLGROUP_GET);
};

export const updateCallGroup = (id, data) => {
    return freeswitchapiUpdate(`${CALLGROUP_UPDATE}${id}`, data);
};

export const deleteCallGroup = (id) => {
    return freeswitchapiDelete(`${CALLGROUP_DELETE}${id}`);
};
