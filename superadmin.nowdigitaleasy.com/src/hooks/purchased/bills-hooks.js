import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBillsCustomView,
  deleteBills,
  getBillsDetails,
  updateBillById,
  billCreate,
  bulkDeleteBills,
  deleteBillPayment,
  updateBillPaymentById,
  createBillPayment,
  getBillPaymentById,
  voidBill,
  unvoidBill,
  getBillPaymentsByBillId,
  getBillCalendarView,
  openBill,
  updateBillPayment,
  getUnpaidBillsByVendor,
} from "../../services/purchased/bills-service";

export function useBillsCustomView({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  sort = "",
  customFilters = [],
}) {
  const validFilter = filter && filter !== "null" ? filter : undefined;

  return useQuery({
    queryKey: [
      "billsCustomView",
      {
        page,
        limit,
        filter: validFilter,
        searchTerm,
        sort,
        customFilters,
      },
    ],
    queryFn: () =>
      getBillsCustomView({
        page,
        limit,
        filter: validFilter,
        searchTerm,
        sort,
        customFilters,
      }),
    enabled: !!validFilter,
  });
}

export const useDeleteBill = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBills,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

export const useInfiniteBills = (params) => {
  return useInfiniteQuery({
    queryKey: ["billsCustomView", params],
    queryFn: ({ pageParam = 1 }) =>
      getBillsCustomView({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },

    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};

export const useGetBillsInfo = (id) => {
  return useQuery({
    queryKey: ["bills", id],
    queryFn: () => getBillsDetails({ id }),
    keepPreviousData: true,
    enabled: !!id,
  });
};

export const useBillsCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: billCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

export const useUpdateBillsById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ billId, data }) => updateBillById(billId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

export const useBulkDeleteBills = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteBills,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};


export const useBillPaymentById = (id) => {
  return useQuery({
    queryKey: ["billPayment", id],
    queryFn: () => getBillPaymentById({ id }),
    enabled: !!id,
  });
};

/* Create */
export const useCreateBillPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createBillPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

/* Update */
export const useUpdateBillPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateBillPaymentById(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billPayment"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

/* Delete */
export const useDeleteBillPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBillPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billPayments"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};


export const useBillPayments = (billId) => {
  return useQuery({
    queryKey: ["billPayments", billId],
    queryFn: () => getBillPaymentsByBillId({ id: billId }),
    enabled: !!billId,
  });
};

export const useBillCalendarView = ({ month, year, entity = "bill", filter, currency }) => {
  return useQuery({
    queryKey: ["billCalendarView", { month, year, entity, filter, currency }],
    queryFn: () => getBillCalendarView({ month, year, entity, filter, currency }),
    enabled: !!month && !!year,
  });
};

// Void and unvoide

export const useVoidBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voidBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};


export const useUnvoidBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unvoidBill,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

export const useOpenBill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openBill,
    onSuccess: (_, billId) => {
      queryClient.invalidateQueries({
        queryKey: ["bills", billId],
      });
      queryClient.invalidateQueries({
        queryKey: ["billsCustomView"],
      });
    },
  });
};

export const useUpdateBillPaymentGeneral = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBillPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billPayment"] });
      queryClient.invalidateQueries({ queryKey: ["bills"] });
      queryClient.invalidateQueries({ queryKey: ["billsCustomView"] });
    },
  });
};

export const useGetUnpaidBillsByVendor = (vendorId) => {
  return useQuery({
    queryKey: ["unpaidBillsByVendor", vendorId],
    queryFn: () => getUnpaidBillsByVendor({ vendorId }),
    enabled: !!vendorId,
  });
};