import { useQuery, useQueryClient,useMutation } from "@tanstack/react-query";
import { addToAdminCart, checkDomain, deleteClientCartItem, deleteOrder, getAdminCartByUser, getAdminOrderById, getAllOrders, getAllProducts, getProductsByGroup, getWalletBalance, makeOrder, updateCart } from "../../services/order/order-service";

export const useAllOrders = ({ 
  page = 1, 
  limit = 10, 
  searchTerm = "", 
  filter = "", 
  date_filter = "", 
  start_date = "", 
  end_date = "",
  sort
}) => {
  return useQuery({
    queryKey: ["orders", page, limit, searchTerm, filter, date_filter, start_date, end_date,sort],
    queryFn: () => getAllOrders({ page, limit, searchTerm, filter, date_filter, start_date, end_date,sort}),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
};


export const useProductsByGroup = (groupId) => {
  return useQuery({
    queryKey: ["productsByGroup", groupId],
    queryFn: () => getProductsByGroup(groupId),
    enabled: !!groupId, 
    staleTime: 5 * 60 * 1000,  
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["allProducts"],
    queryFn: getAllProducts,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useAdminCart = (userId) => {
  return useQuery({
    queryKey: ["adminCart", userId],
    queryFn: () => getAdminCartByUser(userId),
    enabled: !!userId, 
    staleTime: 5 * 60 * 1000, 
  });
};

export const useAddToAdminCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToAdminCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCart"] });
    },
  });
};

// export const useRemoveClientCart = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: removeFromClientCart,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["adminCart"] });
//     },
//   });
// };

export const useRemoveClientCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteClientCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminCart"] });
    },
  });
};

export const useMakeOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: makeOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useWalletBalance = (clientId, workspace_Id) => {
  return useQuery({
    queryKey: ["walletBalance", clientId, workspace_Id],
    queryFn: () => getWalletBalance(clientId, workspace_Id),
    enabled: !!clientId && !!workspace_Id,  // only run if both exist
  });
};

export const useDomainCheck = (domain) => {
  return useQuery({
    queryKey: ["domainCheck", domain],
    queryFn: () => checkDomain(domain),
    enabled: false, 
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adminCart"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useAdminOrderById = (id) => {
  return useQuery({
    queryKey: ["adminOrder", id],
    queryFn: () => getAdminOrderById(id),
    enabled: !!id, 
  });
};
