import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlesk, createPlesk, updatePlesk, deletePlesk } from "../../services/setting/plesk-service";

// Fetch Plesk items
export const usePlesk = () => {
  return useQuery({
    queryKey: ["plesk"],
    queryFn: getPlesk,
    staleTime: 5 * 60 * 1000, 
  });
};

// Create Plesk item
export const useCreatePlesk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlesk,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plesk"] }),
  });
};

// Update Plesk item
export const useUpdatePlesk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePlesk(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plesk"] }),
  });
};

// Delete Plesk item
export const useDeletePlesk = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlesk,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plesk"] }),
  });
};
