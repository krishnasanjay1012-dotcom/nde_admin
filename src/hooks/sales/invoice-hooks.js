import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getInvoices,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  getInvoiceById,
  importInoiceExcel,
  getInvoiceMailDetailsId,
  createContactPerson,
  getStatementPreview,
  SendInvoiceMail,
  getSalesPersonList,
  BulkDeleteInvoices,
  getPaymentModesList,
  getFromAccList,
  createRefund,
  getRefundDetails,
  createPaymentMode,
  deletePayment,
  createWriteOff,
  cancelWriteOff,
  getDespostToList,
  createRecordPayment,
  configurePaymentId,
  overviewcurrencylist,
  getInvoiceOverview,
  taxSectionList,
  payableAccountList,
  receivableAccountList,
  createTDS,
  createVoidInvoice,
  updateTDS,
  deleteTDS,
  sentInvoice,
  getShareLink,
  generateInvoiceLink,
  getSecureInvoiceOverview,
  sendInvoiceOtp,
  verifyInvoiceOtp,
  DisableInvoiceLink,
} from "../../services/sales/invoice-service";

export const useInvoices = ({
  page = 1,
  limit = 10,
  searchTerm = "",
  filter = "",
  date_filter = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters,
}) => {
  return useQuery({
    queryKey: [
      "invoices",
      page,
      limit,
      searchTerm,
      filter,
      date_filter,
      start_date,
      end_date,
      sort,
      customFilters,
    ],
    queryFn: () =>
      getInvoices({
        page,
        limit,
        searchTerm,
        filter,
        date_filter,
        start_date,
        end_date,
        sort,
        customFilters,
      }),
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
    enabled: filter !== null && filter !== undefined,
  });
};

export const useInvoiceById = (id) => {
  return useQuery({
    queryKey: ["invoice", id],
    queryFn: () => getInvoiceById(id),
    enabled: !!id, // only fetch if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useInvoiceMailDetails = (id) => {
  return useQuery({
    queryKey: ["invoice_mailDetails", id],
    queryFn: () => getInvoiceMailDetailsId(id),
    enabled: !!id, // only fetch if id is provided
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
};

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
};

export const useCreateContactPerson = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createContactPerson,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["contactperso"] }),
  });
};

export const useInvoiceSendMail = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: SendInvoiceMail,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
};

export const useUpdateManualInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateInvoice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
};

export const useCreateManualInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInvoice,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
  });
};

export const useCreateTDS = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTDS,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tax_tds"] }),
  });
};

export const useUpdateTDS = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updateTDS(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tax_tds"] }),
  });
};

export const useDeleteTDS = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTDS,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tax_tds"] }),
  });
};

// export const useUpdateManualInvoice = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: UpdateManualInvoice,
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["invoices"] }),
//   });
// };

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
};

export const useBulkDeleteInvoice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: BulkDeleteInvoices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["invoice"] });
    },
  });
};

export const useImportInvoiceExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importInoiceExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
};

export const useTransactionStatement = ({
  start_date = "",
  end_date = "",
  workSpaceId,
  userId,
  invoiceId,
  applied,
  onAppliedReset,
}) => {
  return useQuery({
    queryKey: [
      "transaction_statement",
      invoiceId,
      start_date,
      end_date,
      workSpaceId,
      userId,
      applied,
    ],
    queryFn: () =>
      getStatementPreview({
        start_date,
        end_date,
        workspaceId: workSpaceId,
        userId,
        invoiceId,
      }),
    enabled: !!invoiceId && applied,
    keepPreviousData: true,

    onSuccess: () => {
      onAppliedReset?.();
    },
  });
};

export const useGetSalesPerson = ({ page = 1, limit = 10, search = "" }) => {
  return useQuery({
    queryKey: ["getSalesPersons", { page, limit, search }],
    queryFn: () => getSalesPersonList({ page, limit, search }),
  });
};

export const useGetPaymentModes = () => {
  return useQuery({
    queryKey: ["getPaymentModes"],
    queryFn: () => getPaymentModesList(),
  });
};

export const useGetFromAccList = () => {
  return useQuery({
    queryKey: ["getFromAccList"],
    queryFn: () => getFromAccList(),
  });
};

export const useGetDepostiToList = () => {
  return useQuery({
    queryKey: ["getDepostiToList"],
    queryFn: () => getDespostToList(),
  });
};

export const useCreateRefund = (invoiceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => createRefund(id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
  });
};

export const useCreateRecordPayment = (invoiceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createRecordPayment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
  });
};

export const useConfigurePaymentId = (invoiceId, module) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: configurePaymentId,
    onSuccess: () => {
      if (module) {
        queryClient.invalidateQueries({
          queryKey: ["invoiceNumber"],
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: ["invoice", invoiceId],
        });
      }
    },
  });
};
export const useDeletePayment = (invoiceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePayment,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
  });
};
export const useCreatePaymentMode = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPaymentMode,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["getPaymentModes"] }),
  });
};

export const useRefundDetails = (id) => {
  return useQuery({
    queryKey: ["refundDetails", id],
    queryFn: () => getRefundDetails(id),
    enabled: !!id,
  });
};

export const useCreateWriteOff = (invoiceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWriteOff,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
  });
};

export const useMakeVoidInvoice = (invoiceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ isVoid, data }) => createVoidInvoice(isVoid, data),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
  });
};

export const useCancelWriteOff = (invoiceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelWriteOff,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["invoice", invoiceId] }),
  });
};

export const useOverviewCurrencyList = () => {
  return useQuery({
    queryKey: ["getOverviewCurrencyList"],
    queryFn: () => overviewcurrencylist(),
  });
};

export const useInvoiceOverview = (id) => {
  return useQuery({
    queryKey: ["invoiceOverview", id],
    queryFn: () => getInvoiceOverview(id),
    enabled: !!id,
  });
};
export const useSectionListinTaxes = () => {
  return useQuery({
    queryKey: ["getTaxSections"],
    queryFn: () => taxSectionList(),
  });
};

export const usePayableAccountList = () => {
  return useQuery({
    queryKey: ["getPayableAccountList"],
    queryFn: () => payableAccountList(),
  });
};

export const useReceivableAccountList = () => {
  return useQuery({
    queryKey: ["getReceivableAccountList"],
    queryFn: () => receivableAccountList(),
  });
};

export const useSentInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sentInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["invoice"],
      });
      queryClient.invalidateQueries({
        queryKey: ["invoices"],
      });
    },
  });
};

export const useInvoiceShare = () => {
  return useMutation({
    mutationFn: getShareLink,
  });
};


export const useGenerateInvoiceLink = () => {
  return useMutation({
    mutationFn: generateInvoiceLink,
  });
};


export const useDisableInvoiceLink = () => {
  return useMutation({
    mutationFn: DisableInvoiceLink,
  });
};
export const useSecureInvoiceOverview = (token, options = {}) => {
  return useQuery({
    queryKey: ["invoiceOverview", token],
    queryFn: () => getSecureInvoiceOverview(token),
    enabled: !!token,
    ...options,
  });
};

export const useSendInvoiceOtp = () => {
  return useMutation({
    mutationFn: sendInvoiceOtp,
  });
};

export const useVerifyInvoiceOtp = () => {
  return useMutation({
    mutationFn: verifyInvoiceOtp,
  });
};