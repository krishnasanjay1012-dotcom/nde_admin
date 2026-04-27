import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, getGlobalSearch, getAdminList, updateAdmin, adminSignUp, deleteAdmin, getAdminCustomers, getAdminDetailsById, updateViewPreference } from "../../services/auth/login";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useGlobalSearch = ({searchValue, category}) => {
  return useQuery({
    queryKey: ["domainSearch", {searchValue, category}],
    queryFn: () => getGlobalSearch({searchValue, category}),
    enabled: !!searchValue && !! category, 
    // staleTime: 5 * 60 * 1000,
    keepPreviousData: true, 
  });
};

export const useAdminList = () => {
  return useQuery({
    queryKey: ["adminList"],
    queryFn: getAdminList,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
    },
  });
};

export const useAdminSignUp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminSignUp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
    },
  });
};


export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAdmin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminList"] });
    },
  });
};

export const useGetAdminCustomers = (adminId) => {
  return useQuery({
    queryKey: ["adminCustomers", adminId],
    queryFn: () => getAdminCustomers(adminId),
    enabled: !!adminId,
  });
};


export const useAdminDetailsById = ({ id, open }) => {
  return useQuery({
    queryKey: ["admin", id],
    queryFn: () => getAdminDetailsById({ id }),
    enabled: !!id && open, 
  });
};

export const useUpdateViewPreference = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateViewPreference,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin"],
      });
    },
  });
};