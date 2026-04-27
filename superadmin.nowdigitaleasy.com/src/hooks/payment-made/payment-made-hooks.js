import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentMadeCustomView,
  deletePaymentMade,
  getPaymentMadeDetails,
  updatePaymentMadeById,
  paymentMadeCreate,
  bulkDeletePaymentMade,
  getPaymentMadeList,
  update_payment_made
} from "../../services/payment-made/payment-made-service"; 

export function usePaymentMadeCustomView({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  type=''
}) {
  const validFilter = filter && filter !== "null" ? filter : undefined;

  return useQuery({
    queryKey: [
      "paymentMadeCustomView",
      {
        page,
        limit,
        filter: validFilter,
        searchTerm,
        start_date,
        end_date,
        sort,
        customFilters,
        type,
      },
    ],
    queryFn: () =>
      getPaymentMadeCustomView({
        page,
        limit,
        filter: validFilter,
        searchTerm,
        start_date,
        end_date,
        sort,
        customFilters,
        type,
      }),
    enabled: !!validFilter,
  });
}

export function useVendorList({
  page = 1,
  limit = 10,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
  type=''
}) {

  return useQuery({
    queryKey: [
      "paymentMadeCustomView",
      {
        page,
        limit,
        searchTerm,
        start_date,
        end_date,
        sort,
        customFilters,
        type,
      },
    ],
    queryFn: () =>
      getPaymentMadeList({
        page,
        limit,
        searchTerm,
        start_date,
        end_date,
        sort,
        customFilters,
        type,
      }),
  });
}


export const useInfinitePaymentMade = (params) => {
  return useInfiniteQuery({
    queryKey: ["paymentMadeCustomView", params],
    queryFn: ({ pageParam = 1 }) =>
      getPaymentMadeCustomView({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },

    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};

export const useDeletePaymentMade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePaymentMade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMadeCustomView"] });
    },
  });
};

export const useGetPaymentMadeInfo = (id) => {
  return useQuery({
    queryKey: ["paymentMade", id],
    queryFn: () => getPaymentMadeDetails({ id }),
    keepPreviousData: true,
    enabled: !!id,
  });
};

export const usePaymentMadeCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: paymentMadeCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMadeCustomView"] });
    },
  });
};

export const useUpdatePaymentMadeById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, data }) => updatePaymentMadeById(vendorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMade"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMadeCustomView"] });
    },
  });
};


export const useBulkDeletePaymentMade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeletePaymentMade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMadeCustomView"] });
    },
  });
};

export const useUpdatePaymentMade = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => update_payment_made(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMade"] });
      queryClient.invalidateQueries({ queryKey: ["paymentMadeCustomView"] });
    },
  });
};