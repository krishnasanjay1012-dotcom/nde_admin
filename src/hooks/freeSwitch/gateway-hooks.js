import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGateways,
  addGateway,
  updateGateway,
  deleteGateway,
} from "../../services/freeSwitch/gateway-service";

export const useGateways = () => {
  return useQuery({
    queryKey: ["gateways"],
    queryFn: getGateways,
  });
};

export const useAddGateway = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addGateway,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
    },
  });
};

export const useUpdateGateway = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateGateway(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
    },
  });
};

export const useDeleteGateway = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deleteGateway(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateways"] });
    },
  });
};
