import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getImpLinks, createImpLink, updateImpLink, deleteImpLink } from "../../services/setting/imp-link-service";

// Fetch important links
export const useImpLinks = () => {
  return useQuery({
    queryKey: ["impLinks"],
    queryFn: getImpLinks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create link
export const useCreateImpLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createImpLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["impLinks"] }),
  });
};

// Update link
export const useUpdateImpLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateImpLink(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["impLinks"] }),
  });
};

// Delete link
export const useDeleteImpLink = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteImpLink,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["impLinks"] }),
  });
};
