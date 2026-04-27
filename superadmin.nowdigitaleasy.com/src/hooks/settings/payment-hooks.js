import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPayments,
  createPayment,
  updatePayment,
  deletePayment,
  getPaymentTypes
} from "../../services/setting/payment-service";

// Fetch payments
export const usePayments = () => {
  return useQuery({
    queryKey: ["payments"],
    queryFn: getPayments,
    staleTime: 5 * 60 * 1000, 
  });
};

// Create payment
export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPayment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
};

// Update payment
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePayment(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
};

// Delete payment
export const useDeletePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["payments"] }),
  });
};

// 


export const usePaymentTypes = () =>
  useQuery({ queryKey: ["paymentTypes"], queryFn: getPaymentTypes, staleTime: 5 * 60 * 1000 });