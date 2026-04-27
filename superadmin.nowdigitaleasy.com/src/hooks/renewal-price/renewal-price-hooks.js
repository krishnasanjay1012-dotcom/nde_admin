import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getDomainRenewalPriceAdmin, payDomainRenewal, paymentGsuiteProduct, renewalPleskProduct, renewGsuitePayment, renewPleskPayment } from "../../services/renewal-price/renewal-price-service";

export const useDomainRenewalPrice = (productId, userId, enabled = true) =>
  useQuery({
    queryKey: ["domainRenewalPrice", productId, userId],
    queryFn: () => getDomainRenewalPriceAdmin(productId, userId),
    enabled: !!productId && !!userId && enabled,
    staleTime: 1000 * 60 * 5,
  });

export const usePaymentGsuiteProduct = (id, userId, enabled = true) =>
  useQuery({
    queryKey: ["paymentGsuiteProduct", id, userId],
    queryFn: () => paymentGsuiteProduct({ id, userId }),
    enabled: !!id && !!userId && enabled,
  });

export const useRenewalPleskProduct = (id, userId, enabled = true) =>
  useQuery({
    queryKey: ["renewalPleskProduct", id, userId],
    queryFn: () => renewalPleskProduct({ id, userId }),
    enabled: !!id && !!userId && enabled,
  });


export const usePayDomainRenewal = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: payDomainRenewal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useRenewGsuitePayment = () => {
  return useMutation({
    mutationFn: renewGsuitePayment,
  });
};

export const useRenewPleskPayment = () => {
  return useMutation({
    mutationFn: renewPleskPayment,
  });
};