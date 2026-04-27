import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGSuitePrices,
  createGSuitePrice,
  updateGSuitePrice,
  deleteGSuitePrice,
  getProducts,
  getMasters,
  getGSuiteById,
} from "../../services/gsuite-price/gsuite-price-service";

export const useGSuitePrices = () => {
  return useQuery({
    queryKey: ["gsuitePrices"],
    queryFn: getGSuitePrices,
    staleTime: 5 * 60 * 1000,
  });
};

export const useGSuiteById = (id) => {
  return useQuery({
    queryKey: ["gsuite", id],
    queryFn: () => getGSuiteById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateGSuitePrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGSuitePrice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gsuitePrices"] }),
  });
};

export const useUpdateGSuitePrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGSuitePrice,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["gsuitePrices"] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["gsuite", variables.id] });
      }
    },
  });
};

export const useDeleteGSuitePrice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteGSuitePrice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["gsuitePrices"] }),
  });
};

export const useMasters = () => {
  return useQuery({
    queryKey: ["masters"],
    queryFn: getMasters,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
    staleTime: 5 * 60 * 1000,
  });
};
