import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addFreeSwitchGroup,
    getFreeSwitchGroup,
    updateFreeSwitchGroup,
    deleteFreeSwitchGroup,
    getWorkspaceUsersDomain,
    getDomainUsers,
    addCallGroup,
    getCallGroup,
    updateCallGroup,
    deleteCallGroup,
} from "../../services/freeSwitch/groups-service";

export const useAddFreeSwitchGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => addFreeSwitchGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["freeSwitchGroups"] });
        },
    });
};

export const useGetFreeSwitchGroup = () => {
    return useQuery({
        queryKey: ["freeSwitchGroups"],
        queryFn: () => getFreeSwitchGroup(),
    });
};

export const useUpdateFreeSwitchGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateFreeSwitchGroup(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["freeSwitchGroups"] });
        },
    });
};

export const useDeleteFreeSwitchGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteFreeSwitchGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["freeSwitchGroups"] });
        },
    });
};

// ── accepts { enabled } option so callers can suppress the request ────────────
export const useGetWorkspaceUsersDomain = (workspaceId, options = {}) => {
    return useQuery({
        queryKey: ["workspaceUsersDomain", workspaceId],
        queryFn: () => getWorkspaceUsersDomain(workspaceId),
        enabled: options.enabled ?? !!workspaceId,
    });
};

export const useGetDomainUsers = (workspaceId, domainId, options = {}) => {
    return useQuery({
        queryKey: ["domainUsers", workspaceId, domainId],
        queryFn: () => getDomainUsers(workspaceId, domainId),
        enabled: options.enabled ?? (!!workspaceId && !!domainId),
    });
};

export const useAddCallGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => addCallGroup(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["callGroups"] });
        },
    });
};

export const useGetCallGroup = () => {
    return useQuery({
        queryKey: ["callGroups"],
        queryFn: () => getCallGroup(),
    });
};

export const useUpdateCallGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => updateCallGroup(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["callGroups"] });
        },
    });
};

export const useDeleteCallGroup = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteCallGroup(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["callGroups"] });
        },
    });
};