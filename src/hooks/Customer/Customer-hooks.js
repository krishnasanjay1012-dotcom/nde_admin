import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  getEmailLog,
  updateClientById,
  getAllCustomers,
  clientSignup,
  getWorkspaceList,
  getCustomerDetails,
  addWorkspace,
  getGsuiteByClient,
  getDomains,
  getPleskData,
  getResellerTLDs,
  getPurchasedProducts,
  getInvoicesByClient,
  getWorkspaceDetails,
  getLogs,
  getPaymentDetails,
  deleteClient,
  mapWorkspaceToClient,
  migrateResellers,
  migratePlesk,
  migrateGSuite,
  bulkDeleteClients,
  workspaceUpdate,
  getUserByWorkspace,
  updateAdminPassword,
  addWalletFund,
  updateOpeningBalance,
  updateWalletTransaction,
  getUserOutstandingPayments,
  getRenewalDataByDate,
  getSubscriptionsByUser,
  moveCustomersToAdmin,
  getClientCustomView,
  getContactPerson,
  getUserStatement,
  importCustomerExcel,
  getUnpaidInvoice,
  getDepositAccounts,
  deleteWriteOff,
  writeOffOpeningBalance,
  setOpeningBalance,
  getOpeningBalance,
} from "../../services/Customer/Customer-service";

export function useCustomerList({
  page = 1,
  limit = 10,
  filter = "",
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
}) {
  return useQuery({
    queryKey: [
      "Admin-customer-list",
      { page, limit, filter, searchTerm, start_date, end_date, sort },
    ],
    queryFn: () =>
      getAllCustomers({
        page,
        limit,
        filter,
        searchTerm,
        start_date,
        end_date,
        sort,
      }),
    keepPreviousData: true,
  });
}

export const useDeleteClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-list"] });
      queryClient.invalidateQueries({ queryKey: ["clientCustomView"] });
      queryClient.refetchQueries({ queryKey: ["usercount"], exact: true });
      queryClient.refetchQueries({ queryKey: ["totalclients"], exact: true });
    },
  });
};

export const useGetCustomerInfo = (id, options = {}) => {
  return useQuery({
    queryKey: ["Admin-customer-info", id],
    queryFn: () => getCustomerDetails({ id }),
    keepPreviousData: true,
    select: (res) => res?.data,
    enabled: !!id,
    ...options,
  });
};

export const useGsuiteByClient = ({
  page = 1,
  limit = 10,
  userId,
  workspace_Id,
}) => {
  return useQuery({
    queryKey: ["gsuiteByClient", page, limit, userId, workspace_Id],
    queryFn: () => getGsuiteByClient({ page, limit, userId, workspace_Id }),
    enabled: !!userId && !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useDomains = ({ page = 1, limit = 10, userId, workspace_Id }) => {
  return useQuery({
    queryKey: ["domains", page, limit, userId, workspace_Id],
    queryFn: () => getDomains({ page, limit, userId, workspace_Id }),
    enabled: !!userId && !!workspace_Id,
    keepPreviousData: true,
  });
};

export const usePleskData = ({
  page = 1,
  limit = 10,
  userId,
  workspace_Id,
}) => {
  return useQuery({
    queryKey: ["pleskData", page, limit, userId, workspace_Id],
    queryFn: () => getPleskData({ page, limit, userId, workspace_Id }),
    enabled: !!userId && !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useResellerTLDs = () => {
  return useQuery({
    queryKey: ["resellerTLDs"],
    queryFn: getResellerTLDs,
  });
};

export const usePurchasedProducts = ({
  page = 1,
  limit = 10,
  workspace_Id,
}) => {
  return useQuery({
    queryKey: ["purchasedProducts", page, limit, workspace_Id],
    queryFn: () => getPurchasedProducts({ page, limit, workspace_Id }),
    enabled: !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useInvoicesByClient = ({
  page = 1,
  limit = 10,
  filter,
  date_filter,
  customStartDate,
  customEndDate,
  workspace_Id,
  isRecordPayment
}) => {
  return useQuery({
    queryKey: [
      "invoicesByClient",
      page,
      limit,
      filter,
      date_filter,
      customStartDate,
      customEndDate,
      workspace_Id,
      isRecordPayment
    ],
    queryFn: () => {
      return getInvoicesByClient({
        page,
        limit,
        filter,
        date_filter,
        customStartDate,
        customEndDate,
        workspace_Id,
        isRecordPayment
      });
    },
    enabled: !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useClientSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clientSignup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-list"] });
      queryClient.invalidateQueries({ queryKey: ["clientCustomView"] });

      // queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};

export const useUpdateClientById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ clientId, data }) => updateClientById(clientId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-info"] });
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-list"] });
      queryClient.invalidateQueries({ queryKey: ["clientCustomView"] });
    },
  });
};
export const useWorkspaceList = (userId) => {
  return useQuery({
    queryKey: ["workspaceList", userId],
    queryFn: async () => {
      const response = await getWorkspaceList(userId);
      console.log("Workspace List Data:", response.data);
      return response;
    },
    enabled: !!userId,
  });
};

export const useAddWorkspace = (userId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addWorkspace,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceList", userId] });
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-list"] });
    },
  });
};

export const useWorkspaceDetails = ({ workspace_Id, userId }) => {
  return useQuery({
    queryKey: ["workspaceDetails", workspace_Id, userId],
    queryFn: () => getWorkspaceDetails({ workspace_Id, userId }),
    enabled: !!workspace_Id && !!userId,
  });
};

export const useEmailLog = ({ userId, workspace_Id, page = 1, limit = 10 }) => {
  return useQuery({
    queryKey: ["emailLog", userId, workspace_Id, page, limit],
    queryFn: () => getEmailLog({ userId, workspace_Id, page, limit }),
    enabled: !!userId && !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useLogs = ({
  userId,
  workspace_Id,
  page = 1,
  limit = 10,
  filter,
}) => {
  return useQuery({
    queryKey: ["logs", userId, workspace_Id, page, limit, filter],
    queryFn: () => getLogs({ userId, workspace_Id, page, limit, filter }),
    enabled: !!userId && !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useInfiniteLogs = (params) => {
  return useInfiniteQuery({
    queryKey: ["infiniteLogs", params],
    queryFn: ({ pageParam = 1 }) =>
      getLogs({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      return lastPage?.hasNextPage ? lastPage.page + 1 : undefined;
    },
    // enabled:!!params?.workspace_Id || !!params?.vendor,
  });
};

export const usePaymentDetails = ({
  workspace_Id,
  page = 1,
  limit = 10,
}) => {
  return useQuery({
    queryKey: ["paymentDetails", workspace_Id, page, limit],
    queryFn: () => getPaymentDetails({ workspace_Id, page, limit }),
    enabled: !!workspace_Id,
    keepPreviousData: true,
  });
};

export const useMapWorkspaceToClient = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: mapWorkspaceToClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["workspaceList"] });
    },
  });
};

export const useMigrateResellers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrateResellers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["domains"] });
    },
  });
};

export const useMigratePlesk = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migratePlesk,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pleskData"] });
    },
  });
};

export const useMigrateGSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: migrateGSuite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gsuiteByClient"] });
    },
  });
};

export const useBulkDeleteClients = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteClients,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-list"] });
      queryClient.invalidateQueries({ queryKey: ["clientCustomView"] });
      queryClient.refetchQueries({ queryKey: ["usercount"], exact: true });
      queryClient.refetchQueries({ queryKey: ["totalclients"], exact: true });
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ _id, data }) => workspaceUpdate(_id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaceDetails"] });
    },
  });
};

export const useUserByWorkspaceId = (workspace_Id) => {
  return useQuery({
    queryKey: ["userByWorkspaceId", workspace_Id],
    queryFn: () => getUserByWorkspace(workspace_Id),
    enabled: !!workspace_Id,
  });
};

export const useGetContactPerson = (workspace_Id) => {
  return useQuery({
    queryKey: ["contactperson", workspace_Id],
    queryFn: () => getContactPerson(workspace_Id),
    enabled: !!workspace_Id,
  });
};

export const useUpdateAdminPassword = () => {
  return useMutation({
    mutationFn: updateAdminPassword,
  });
};

export const useAddWalletFund = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addWalletFund,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentDetails"] });
    },
  });
};

export const useUpdateOpeningBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOpeningBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
    },
  });
};

export const useUpdateWalletTransaction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateWalletTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentDetails"] });
    },
  });
};

// Customer OverView Details

export const useUserOutstandingPayments = (worksapce_id, params) => {
  return useQuery({
    queryKey: ["userPayments", worksapce_id, params],
    queryFn: () => getUserOutstandingPayments(worksapce_id, params),
    enabled: !!worksapce_id,
  });
};

export const useSubscriptionsByUser = (params) => {
  return useQuery({
    queryKey: ["subscriptionsByUser", params],
    queryFn: () => getSubscriptionsByUser(params),
  });
};

export const useRenewalDataByDate = ({ user, service, page, limit }) => {
  return useQuery({
    queryKey: ["renewalData", user, service, page, limit],
    queryFn: () => getRenewalDataByDate({ user, service, page, limit }),
    enabled: !!user,
  });
};

export const useMoveCustomersToAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ adminId, users }) =>
      moveCustomersToAdmin({ adminId, users }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientCustomView"] });
      queryClient.invalidateQueries({ queryKey: ["Admin-customer-info"] });
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

//

export function useClientCustomView({
  page = 1,
  limit = 10,
  filter,
  searchTerm = "",
  start_date = "",
  end_date = "",
  sort = "",
  customFilters = [],
}) {
  const validFilter = filter && filter !== "null" ? filter : undefined;

  return useQuery({
    queryKey: [
      "clientCustomView",
      {
        page,
        limit,
        filter: validFilter,
        searchTerm,
        start_date,
        end_date,
        sort,
        customFilters,
      },
    ],
    queryFn: () =>
      getClientCustomView({
        page,
        limit,
        filter: validFilter,
        searchTerm,
        start_date,
        end_date,
        sort,
        customFilters,
      }),
    enabled: !!validFilter, // only runs if valid id
  });
}

export const useDepositaccounts = (params) => {
  return useQuery({
    queryKey: ["depositaccounts", params],
    queryFn: () => getDepositAccounts(params),
  });
};

export const useStatementDetails = (params) => {
  return useQuery({
    queryKey: ["statements", params],
    queryFn: () => getUserStatement(params),
    enabled: !!params.workspaceId,
  });
};

export const useImportCustomerExcel = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: importCustomerExcel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientCustomView"] });
    },
  });
};
export const useGetUnpaidInvoice = (userId) => {
  return useQuery({
    queryKey: ["unpaidInvoice"],
    queryFn: () => getUnpaidInvoice(userId),
  });
};


export const useOpeningBalance = (workspaceId, options = {}) => {
  return useQuery({
    queryKey: ["openingBalance", workspaceId],
    queryFn: () => getOpeningBalance(workspaceId),
    enabled: !!workspaceId,
    ...options,
  });
};


export const useSetOpeningBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setOpeningBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["openingBalance"],
      });
    },
  });
};

export const useWriteOffOpeningBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: writeOffOpeningBalance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["openingBalance"],
      });
    },
  });
};

export const useDeleteWriteOff = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWriteOff,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["openingBalance"],
      });
    },
  });
};