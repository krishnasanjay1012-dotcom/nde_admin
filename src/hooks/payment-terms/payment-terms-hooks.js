import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addPaymentTerm,
  getAllPaymentTerms,
  getPaymentTermById,
  updatePaymentTerm,
  deletePaymentTerm,
  getInvoiceNumber,
} from "../../services/payment-terms/payment-service";

/* Get all terms */
export const usePaymentTerms = () => {
  return useQuery({
    queryKey: ["paymentTerms"],
    queryFn: getAllPaymentTerms,
  });
};



export const useInvoiceNumber = (type) => {
  return useQuery({
    queryKey: ["invoiceNumber", type],
    queryFn: () => getInvoiceNumber(type),
    enabled:!!type,
  });
};


/* Get term by ID */
export const usePaymentTermById = ({ id }) => {
  return useQuery({
    queryKey: ["paymentTerm", id],
    queryFn: () => getPaymentTermById({ id }),
    enabled: !!id,
  });
};

/* Add term */
export const useAddPaymentTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPaymentTerm,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["paymentTerms"] }),
  });
};

/* Update term */
export const useUpdatePaymentTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePaymentTerm,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["paymentTerms"] }),
  });
};

/* Delete term */
export const useDeletePaymentTerm = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentTerm,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["paymentTerms"] }),
  });
};
