import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrencies,
  createCurrency,
  updateCurrency,
  deleteCurrency,
  getCurrencyByCode,
} from "../../services/setting/currency-service";

// Hook to fetch currencies
export const useCurrencies = () => {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: getCurrencies,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to create a currency
export const useCreateCurrency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
  });
};

// Hook to update a currency
export const useUpdateCurrency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateCurrency(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
  });
};

// Hook to delete a currency
export const useDeleteCurrency = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCurrency,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currencies"] });
    },
  });
};

export const useCurrencyByCode = () => {
  return useMutation({
    mutationFn: getCurrencyByCode,
  });
};
