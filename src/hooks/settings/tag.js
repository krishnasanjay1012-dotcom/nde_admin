// hooks/useTags.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTags, createTag, updateTag, deleteTag } from "../../services/setting/tag-service";

// Fetch tags
export const useTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: getTags,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
};

// Update tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTag(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
};

// Delete tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
};
