import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getResellers, createReseller, updateReseller, deleteReseller, getTlds } from "../../services/setting/resellers-service";

// Fetch resellers
export const useResellers = () => {
  return useQuery({
    queryKey: ["resellers"],
    queryFn: getResellers,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create reseller
export const useCreateReseller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createReseller,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resellers"] }),
  });
};

// Update reseller
export const useUpdateReseller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateReseller(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resellers"] }),
  });
};

// Delete reseller
export const useDeleteReseller = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReseller,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["resellers"] }),
  });
};

export const useGetTlds = () => {
  return useQuery({
    queryKey: ["tlds"],
    queryFn: getTlds,
  });
};
