import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllProducts,deleteProduct, getPleskList } from "../../services/hosting-price/hosting-price-service";

export const useAllProducts = (filter = "all") => {
  return useQuery({
    queryKey: ["allProducts", filter],
    queryFn: () => getAllProducts({ filter }),
    staleTime: 5 * 60 * 1000, 
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allProducts"] });
    },
  });
};

export const usePleskList = () => {
  return useQuery({
    queryKey: ["pleskList"],
    queryFn: getPleskList,
    staleTime: 5 * 60 * 1000,
  });
};
