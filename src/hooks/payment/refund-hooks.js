import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addRefund,
  deleteRefund,
  getRefundByID,
  getRefundList,
  updateRefund,
} from "../../services/payment/refund-service";


export const useDeleteRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteRefund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};


export const useAddRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ paymentId, data }) => addRefund(paymentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};


export const useRefundList = ({ id, workspaceId }) => {
  return useQuery({
    queryKey: ["refunds", id, workspaceId],
    queryFn: () => getRefundList({ id, workspaceId }),
    enabled: !!id && !!workspaceId,
  });
};


export const useRefundByID = (id) => {
  return useQuery({
    queryKey: ["refund", id],
    queryFn: () => getRefundByID(id),
    enabled: !!id,
  });
};

export const useUpdateRefund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateRefund(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["refund", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["refunds"] });
    },
  });
};


