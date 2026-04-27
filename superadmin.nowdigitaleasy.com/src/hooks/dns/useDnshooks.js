import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDnsZones,
  createDnsDomain,
  getTemplates,
  getTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  toggleTemplateStatus,
  getTemplateValues,
  createTemplateValue,
  updateTemplateValue,
  getTemplateValueById,
  previewZoneTemplate,
  switchZoneTemplate,
  getZoneDetails
} from "../../services/dns/dns-service";


// --- ZONE HOOKS ---

export const useDnsZones = () => {
  return useQuery({
    queryKey: ["admin-dns-zones"],
    queryFn: getDnsZones,
  });
};

export const useCreateDnsDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createDnsDomain(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-dns-zones"] });
    },
  });
}

// --- TEMPLATES HOOKS ---

export const useTemplates = (filters = {}) => {
  return useQuery({
    queryKey: ["admin-templates", filters],
    queryFn: () => getTemplates(filters),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTemplate = (id) => {
  return useQuery({
    queryKey: ["admin-template", id],
    queryFn: () => getTemplate(id),
    enabled: !!id,
  });
};

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createTemplate(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
    },
  });
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateTemplate(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
      queryClient.invalidateQueries({ queryKey: ["admin-template", variables.id] });
    },
  });
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteTemplate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
    },
  });
};

export const useToggleTemplate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => toggleTemplateStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-templates"] });
    },
  });
};


// --- TEMP_VALUE HOOKS ---


export const useTemplateValues = () => {
  return useQuery({
    queryKey: ["admin-template-values"],
    queryFn: () => getTemplateValues(),
  });
};

export const useCreateTemplateValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => createTemplateValue(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-template-values"] });
    },
  });
};

export const useUpdateTemplateValue = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }) => updateTemplateValue(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-template-values"] });
      queryClient.invalidateQueries({ queryKey: ["admin-template-value", variables.id] });
    }
  });
};

export const useTemplateValueById = (id) => {
  return useQuery({
    queryKey: ["admin-template-value", id],
    queryFn: () => getTemplateValueById(id),
    enabled: !!id
  })
}


export const usePreviewTemplate = () => {
  return useMutation({
    mutationFn: (payload) => previewZoneTemplate(payload),
  });
};


export const useSwitchTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ zoneId, payload }) => switchZoneTemplate(zoneId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["getRecordsByID", variables.zoneId] });
    },
  });
};

export const useZoneByName = (zoneName) => {
    return useQuery({
        queryKey: ["zoneDetails", zoneName],
        queryFn: () => getZoneDetails(zoneName),
        enabled: !!zoneName,
        staleTime: 5 * 60 * 1000,
        retry: false,
    });
};