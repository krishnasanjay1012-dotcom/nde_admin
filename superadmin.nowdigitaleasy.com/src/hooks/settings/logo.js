// hooks/useLogos.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLogos, createLogo, updateLogo, deleteLogo, updateClientLogo } from "../../services/setting/logo-service";

// Fetch logos
export const useLogos = () => {
  return useQuery({
    queryKey: ["logos"],
    queryFn: getLogos,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create logo
export const useCreateLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createLogo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["logos"] }),
  });
};

// Update logo
export const useUpdateLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateLogo(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["logos"] }),
  });
};


// Delete logo
export const useDeleteLogo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLogo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["logos"] }),
  });
};

export const useUpdateClientLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => updateClientLogo(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logos"] });
    },
  });
};