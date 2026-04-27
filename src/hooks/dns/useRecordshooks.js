import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getZoneRecords, getOneRecord, addRecord, updateRecord, deleteRecord, addbulkRecord, getZonePresets, addPreset, updatePreset, deletePreset } from "../../services/dns/dns-service";

// --- ZONE RECORDS HOOKS ---

export const useZoneRecords = (zoneId, filters) => {
    return useQuery({
        queryKey: ["getRecordsByID", zoneId, filters],
        queryFn: () => getZoneRecords(zoneId, filters),
        enabled: !!zoneId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useOneRecord = (zoneId, recordId) => {
    return useQuery({
        queryKey: ["oneRecord", recordId],
        queryFn: () => getOneRecord(zoneId, recordId),
        enabled: !!recordId,
    });
};

export const useAddRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ zoneId, payload }) => addRecord(zoneId, payload),

        onSuccess: (_, variables) => {
            // Must match queryKey used by useZoneRecords: ["getRecordsByID", zoneId, filters]
            queryClient.invalidateQueries({ queryKey: ["getRecordsByID", variables.zoneId] });
        },
    });
};

export const useBulkRecords = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ zoneId, payload }) => addbulkRecord(zoneId, payload),

        onSuccess: (_, variables) => {
            // Must match queryKey used by useZoneRecords: ["getRecordsByID", zoneId, filters]
            queryClient.invalidateQueries({ queryKey: ["getRecordsByID", variables.zoneId] });
        },
    });
}

export const useUpdateRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ zoneId, recordId, payload }) =>
            updateRecord(zoneId, recordId, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["getRecordsByID", variables.zoneId] });
        },
    });
};

export const useDeleteRecord = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ zoneId, recordId }) =>
            deleteRecord(zoneId, recordId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["getRecordsByID", variables.zoneId] });
        },
    });
};

// --- PRESET HOOKS ---

export const usePresets = (zoneId,template_id) => {
    return useQuery({
        queryKey: ["getPresetsByZoneID", zoneId, template_id],
        queryFn: () => getZonePresets(zoneId, template_id),
        enabled: !!zoneId,
        staleTime: 5 * 60 * 1000,
    });
};

export const useAddPreset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ payload }) => addPreset(payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["getPresetsByZoneID", variables.payload.zoneId] });
        },
    });
};

export const useUpdatePreset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ presetId, payload }) => updatePreset(presetId, payload),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["getPresetsByZoneID", variables.payload.zoneId] });
        },
    });
};

export const useDeletePreset = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ presetId, zoneId }) => deletePreset(presetId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["getPresetsByZoneID", variables.zoneId] });
        },
    });
};