import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getItemCustomView,
  deleteItem,
  getItemDetails,
  updateItemById,
  itemCreate,
  bulkDeleteItems,
  addNote,
  updateNote,
  deleteNote,
  getNoteById,
  getAllNotes,
  uploadItemLogo,
  removeItemLogo,
  searchHSNCode
} from "../../services/Items/Items-service";


export function useItemCustomView({
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
      "itemCustomView",
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
      getItemCustomView({
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


export const useInfiniteItems = (params) => {
  return useInfiniteQuery({
    queryKey: ["items", params],
    queryFn: ({ pageParam = 1 }) =>
      getItemCustomView({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },

    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};


export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemCustomView"] });
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};


export const useGetItemInfo = (id) => {
  return useQuery({
    queryKey: ["item", id],
    queryFn: () => getItemDetails({ id }),
    keepPreviousData: true,
    enabled: !!id,
  });
};


export const useItemCreate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemCustomView"] });
    },
  });
};


export const useUpdateItemById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, data }) => updateItemById(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item"] });
      queryClient.invalidateQueries({ queryKey: ["itemCustomView"] });
    },
  });
};


export const useBulkDeleteItems = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteItems,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemCustomView"] });
    },
  });
};


/* Add note */
export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["itemNotes"],
      });
    },
  });
};

/* Update note */
export const useUpdateNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemNotes"] });
    },
  });
};

/* Delete note */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemNotes"] });
    },
  });
};

/* Get note by ID */
export const useItemNoteById = ({ id }) => {
  return useQuery({
    queryKey: ["itemNotes", id],
    queryFn: () => getNoteById({ id }),
    enabled: !!id,
  });
};

/* Get all notes */
export const useItemNotes = ({ itemId }) => {
  return useQuery({
    queryKey: ["itemNotes", itemId],
    queryFn: () => getAllNotes({ itemId }),
    enabled: !!itemId,
  });
};



export const useUploadItemLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadItemLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item"] });
      queryClient.invalidateQueries({ queryKey: ["itemCustomView"] });
    },
  });
};

export const useRemoveItemLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeItemLogo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item"] });
      queryClient.invalidateQueries({ queryKey: ["itemCustomView"] });
    },
  });
};

export const useHSNSearch = ({ searchText, isService = false, country = "india" }) => {
  return useQuery({
    queryKey: ["hsnSearch", searchText, isService, country],
    queryFn: () => searchHSNCode({ searchText, isService, country }),
    keepPreviousData: true,
    enabled: !!searchText,
  });
};