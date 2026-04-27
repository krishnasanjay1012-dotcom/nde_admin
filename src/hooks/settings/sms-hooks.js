import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSmsConfig,
  createSmsConfig,
  updateSmsConfig,
  deleteSmsConfig,
  enableSmsConfig,
  getAllSmsTemplates,
  getSmsTemplateById,
  createSmsTemplate,
  updateSmsTemplate,
  deleteSmsTemplate,
} from "../../services/setting/sms-service";

// ── SMS Config ────────────────────────────────────────────────
export const useSmsConfig = () => {
  return useQuery({
    queryKey: ["smsConfig"],
    queryFn: getSmsConfig,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSmsConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSmsConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smsConfig"] }),
  });
};

export const useUpdateSmsConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSmsConfig(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smsConfig"] }),
  });
};

export const useDeleteSmsConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSmsConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smsConfig"] }),
  });
};

export const useEnableSmsConfig = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: enableSmsConfig,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["smsConfig"] }),
  });
};

// ── SMS Templates ─────────────────────────────────────────────
export const useAllSmsTemplates = () => {
  return useQuery({
    queryKey: ["smsTemplates"],
    queryFn: getAllSmsTemplates,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSmsTemplateById = (id) => {
  return useQuery({
    queryKey: ["smsTemplate", id],
    queryFn: () => getSmsTemplateById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSmsTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSmsTemplate,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["smsTemplates"] }),
  });
};

export const useUpdateSmsTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateSmsTemplate(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["smsTemplates"] }),
  });
};

export const useDeleteSmsTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSmsTemplate,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["smsTemplates"] }),
  });
};
