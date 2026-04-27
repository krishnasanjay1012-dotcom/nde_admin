import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bulkMapGSuiteTransactions, getGSuiteTransactionByDomain, getGSuiteTransactions, getTdsTaxAccounts, importGSuiteExcel, openPayment, unvoidPayment, updateGSuiteTransaction, voidPayment } from "../../services/payment/payment-service";

export const useImportGSuiteExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importGSuiteExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuiteTransactions"] });
    },
  });
};

export const useGSuiteTransactions = ({
  query = "",
  sort = "",
  limit = 10,
  page = 1,
  filter = "",
  start_date = "",
  end_date = "",
}) => {
  return useQuery({
    queryKey: ["gsuiteTransactions", query, sort, limit, page, filter, start_date, end_date],
    queryFn: () =>
      getGSuiteTransactions({ query, sort, limit, page, filter, start_date, end_date }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateGSuiteTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateGSuiteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuiteTransactions"] });
    },
  });
};

export const useBulkMapGSuiteTransactions = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkMapGSuiteTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuiteTransactions"] });
    },
  });
};

export const useGSuiteTransactionByDomain = ({ domain, filter, year, limit, page }) => {
  return useQuery({
    queryKey: ["gsuiteTransactionByDomain", domain, filter, year, limit, page],
    queryFn: () => getGSuiteTransactionByDomain({ domain, filter, year, limit, page }),
    // enabled: !!domain,
    staleTime: 5 * 60 * 1000,
  });
};


//




import {
  getAllPaymentDetails,
  createPaymentRecord,
  getPaymentDetailsById,
  deletePaymentDetailsById,
  getPaymentModes,
  getFromAccounts,
  updatePaymentRecord,
} from "../../services/payment/payment-service";

/* Get all payments */
export const usePaymentList = (params) => {

  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getAllPaymentDetails(params),
    enabled: !!params?.filter 
  });
};

export const usePaymentDetails = (params) => {
  return useInfiniteQuery({
    queryKey: ["payments", params],
    queryFn: ({ pageParam = 1 }) => getAllPaymentDetails({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.page < lastPage.totalPages ? lastPage.nextPage : undefined,
    keepPreviousData: true,
  });
};

/* Get payment by ID */
export const usePaymentDetailsById = ({ id }) => {
  return useQuery({
    queryKey: ["payment", id],
    queryFn: () => getPaymentDetailsById({ id }),
    enabled: !!id,
  });
};

/* Create payment */
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPaymentRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

/* Update payment */
export const useUpdatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updatePaymentRecord(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

/* Delete payment */
export const useDeletePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePaymentDetailsById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

/* Payment modes */
export const usePaymentModes = () => {
  return useQuery({
    queryKey: ["paymentModes"],
    queryFn: getPaymentModes,
    staleTime: 10 * 60 * 1000,
  });
};

/* From Accounts */
export const useFromAccounts = () => {
  return useQuery({
    queryKey: ["depositAccounts"],
    queryFn: getFromAccounts,
    staleTime: 10 * 60 * 1000,
  });
};

export const useTdsTaxAccounts = () => {
  return useQuery({
    queryKey: ["tdsTaxAccounts"],
    queryFn: getTdsTaxAccounts,
    staleTime: 10 * 60 * 1000,
  });
};


export const useVoidPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: voidPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};


export const useUnvoidPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unvoidPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useOpenPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: openPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payment"],
      });
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
    },
  });
};