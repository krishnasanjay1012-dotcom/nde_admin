import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCustomerCustomView, deleteCustomView, getAvailableFields, getCustomerFilterOptions, getCustomViewById, getFilterFields, updateCustomView, updateCustomViewFavorite } from "../../services/Custom-view/custom-view";

export const useCustomerFilterOptions = (module) => {
  return useQuery({
    queryKey: ["customerFilterOptions",module],
    queryFn:  () => getCustomerFilterOptions(module), 
    enabled: !!module,
  });
};

export const useUpdateCustomViewFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ module, viewId }) =>
      updateCustomViewFavorite({ module, viewId }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customerFilterOptions"],
      });
    },
  });
};

export const useAvailableFields = (module, options = {}) => {
  return useQuery({
    queryKey: ["availableFields", module],
    queryFn: () => getAvailableFields(module),
    enabled: !!module,
    ...options,
  });
};

export const useFilterFields = (module, options = {}) => {
  return useQuery({
    queryKey: ["filterFields", module],
    queryFn: () => getFilterFields(module),
    enabled: !!module,
    ...options,
  });
};


export const useCreateCustomerCustomView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomerCustomView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerCustomViews"] });
      queryClient.invalidateQueries({ queryKey: ["customerFilterOptions"] });
    },
  });
};


export const useDeleteCustomView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomView,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["customerFilterOptions"],
      });
    },
  });
};

export const useGetCustomViewById = (
  module,
  viewId,
  options = {}
) => {
  return useQuery({
    queryKey: ["customViewById", module, viewId],
    queryFn: () =>
      getCustomViewById({ module, viewId }),
    enabled: !!module && !!viewId,
    ...options,
  });
};

export const useUpdateCustomView = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCustomView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerCustomViews"] });
      queryClient.invalidateQueries({ queryKey: ["customerFilterOptions"] });
    },
  });
};
