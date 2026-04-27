import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { getAccountTree, createAccount, getAccountsList, getAccounts, getAccountById, updateAccount, deleteAccount, getAccountLedger, getItemTransactions} from "../../services/account/account-service";




export const useAccounts = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: getAccounts,
  });
};

export function useAccountsCustomList({
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
      "accounts",
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
      getAccountsList({
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

// Fetch accounts tree
export const useAccountTree = () => {
  return useQuery({
    queryKey: ["accountsTree"],
    queryFn: getAccountTree,
  });
};

// Create account
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["accountsTree"] });
    },
  });
};

export const useGetAccountById = (id) => {
  return useQuery({
    queryKey: ["accountById", id],
    queryFn: () => getAccountById(id),
    enabled: !!id,
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accountById"],
      });
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};


export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useInfiniteAccoutList = (params) => {
  return useInfiniteQuery({
    queryKey: ["accounts", params],
    queryFn: ({ pageParam = 1 }) =>
      getAccountsList({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },

    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};

export const useAccountLedger = (accountId, options = {}) => {
  return useQuery({
    queryKey: ["accountLedger", accountId],
    queryFn: () => getAccountLedger(accountId),
    enabled: !!accountId,
    ...options,
  });
};

export const useItemTransactions = (id, options = {}) => {
  return useQuery({
    queryKey: ["itemTransactions", id],
    queryFn: () => getItemTransactions(id),
    enabled: !!id,
    ...options,
  });
};