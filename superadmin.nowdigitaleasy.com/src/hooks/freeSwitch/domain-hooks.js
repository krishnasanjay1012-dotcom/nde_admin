import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getFreeSwitchDomains,
  getFreeSwitchDomainById,
  addFreeSwitchDomain,
  updateFreeSwitchDomain,
  deleteFreeSwitchDomain,
  checkFreeSwitchDomain,
} from "../../services/freeSwitch/domain-service";

export const useFreeSwitchDomains = () => {
  return useQuery({
    queryKey: ["freeSwitchDomains"],
    queryFn: getFreeSwitchDomains,
  });
};

export const useFreeSwitchDomainById = (id) => {
  return useQuery({
    queryKey: ["singlefreeSwitchDomain", id],
    queryFn: () => getFreeSwitchDomainById(id),
    enabled: !!id,
  });
};

export const useAddFreeSwitchDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFreeSwitchDomain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchDomains"] });
    },
  });
};

export const useUpdateFreeSwitchDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateFreeSwitchDomain(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchDomains"] });
    },
  });
};

export const useDeleteFreeSwitchDomain = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteFreeSwitchDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchDomains"] });
    },
  });
};

export const useCheckFreeSwitchDomain = () => {
  return useMutation({
    mutationFn: checkFreeSwitchDomain,
  });
};