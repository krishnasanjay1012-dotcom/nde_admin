import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExtensions,
  addExtension,
  updateExtension,
  deleteExtension,
  getWorkspaceDomains,
} from "../../services/freeSwitch/extension-service";

export const useExtensions = () => {
  return useQuery({
    queryKey: ["freeSwitchExtensions"],
    queryFn: getExtensions,
  });
};

export const useAddExtension = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addExtension,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchExtensions"] });
    },
  });
};

export const useUpdateExtension = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateExtension(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchExtensions"] });
    },
  });
};

export const useDeleteExtension = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteExtension(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchExtensions"] });
    },
  });
};

export const useWorkspaceDomains = (id) => {
  return useQuery({
    queryKey: ["workspaceDomains", id],
    queryFn: () => getWorkspaceDomains(id),
    enabled: !!id,
  });
};
