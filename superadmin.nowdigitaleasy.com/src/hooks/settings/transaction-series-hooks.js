import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCounters, updateAllCounters } from "../../services/setting/transaction-series-service";

export const useGetAllCounters = () => {
  return useQuery({
    queryKey: ["allCounters"],
    queryFn: getAllCounters,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateAllCounters = () => {
  const queryClient = useQueryClient();

  return useMutation({
    queryKey: ["update_allCounters"],
    mutationFn:updateAllCounters,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["allCounters"] }),
  });
};
