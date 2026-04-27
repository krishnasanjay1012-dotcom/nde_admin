import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getGSuite, createGSuite, updateGSuite, deleteGSuite, updateGSuiteServer, makeGSuiteDefaultConfig, makeGSuiteOAuth, updateGSuiteCurrency, updateS3Config, getS3Configs } from "../../services/setting/gsuite-service";

// Fetch G-Suite items
export const useGSuite = () => {
  return useQuery({
    queryKey: ["gsuite"],
    queryFn: getGSuite,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Create G-Suite item
export const useCreateGSuite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGSuite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gsuite"] }),
  });
};

// Update G-Suite item
export const useUpdateGSuite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateGSuite(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gsuite"] }),
  });
};

// Delete G-Suite item
export const useDeleteGSuite = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGSuite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gsuite"] }),
  });
};

export const useUpdateGSuiteServer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGSuiteServer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuite"] });
    },
  });
};

export const useMakeGSuiteDefaultConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeGSuiteDefaultConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuite"] });
    },
  });
};

export const useMakeGSuiteOAuth = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeGSuiteOAuth,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuiteOAuthActiveConfig"] });
    },
  });
};

export const useUpdateGSuiteCurrency = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateGSuiteCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuite"] });
      queryClient.invalidateQueries({ queryKey: ["gsuiteConfigs"] });
    },
  });
};

export const useS3Configs = () => {
  return useQuery({
    queryKey: ["s3Configs"],
    queryFn: getS3Configs,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateS3Config = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateS3Config(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["s3Configs"] });
    },
  });
};
