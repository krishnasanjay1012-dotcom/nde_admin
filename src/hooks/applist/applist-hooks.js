import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addAppDetails,
  getAllAppDetails,
  getAppDetailsByName,
  updateAppDetails,
  deleteAppDetails,
} from "../../services/applist/applist-service";

export const useAppDetails = () => {
  return useQuery({
    queryKey: ["appDetails"],
    queryFn: getAllAppDetails,
  });
};

export const useAppDetailsByName = (appName) => {
  return useQuery({
    queryKey: ["appDetailsByName", appName],
    queryFn: () => getAppDetailsByName(appName),
    enabled: !!appName,
  });
};

export const useAddAppDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addAppDetails,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appDetails"] }),
  });
};

export const useUpdateAppDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAppDetails,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appDetails"] }),
  });
};

export const useDeleteAppDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAppDetails,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["appDetails"] }),
  });
};
