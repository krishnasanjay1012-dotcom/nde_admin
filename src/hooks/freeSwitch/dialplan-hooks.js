import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDialPlans,
  addDialPlan,
  updateDialPlan,
  deleteDialPlan
} from "../../services/freeSwitch/dialplan-service";

export const useDialPlans = () => {
  return useQuery({
    queryKey: ["freeSwitchDialPlans"],
    queryFn: getDialPlans,
  });
};

export const useAddDialPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addDialPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchDialPlans"] });
    },
  });
};

export const useUpdateDialPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateDialPlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchDialPlans"] });
    },
  });
};


export const useDeleteDialPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteDialPlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["freeSwitchDialPlans"] });
    },
  });
};

