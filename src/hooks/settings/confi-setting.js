import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConfigSettings, getGSuiteOAuthActiveConfig, updateConfigSettings } from "../../services/setting/confi-serivce";

// Hook to fetch config settings
export const useConfigSettings = () => {
  return useQuery({
    queryKey: ["configSettings"],
    queryFn: getConfigSettings,
    staleTime: 5 * 60 * 1000, 
  });
};

// Hook to update config settings
export const useUpdateConfigSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateConfigSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configSettings"] });
    },
  });
};



export const useGSuiteOAuthActiveConfig = () => {
  return useQuery({
    queryKey: ["gsuiteOAuthActiveConfig"],
    queryFn: getGSuiteOAuthActiveConfig,
    staleTime: 5 * 60 * 1000, 
  });
};
