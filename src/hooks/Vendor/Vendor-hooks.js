import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getVendorCustomView,
  deleteVendor,
  getVendorDetails,
  updateVendorById,
  vendorCreate,
  bulkDeleteVendors,
  addNote,
  updateNote,
  deleteNote,
  getNoteById,
  getAllNotes,
  getVendorList,
  updateBillingShippingAddress
} from "../../services/Vendor/Vendor-service"; 

export function useVendorCustomView({
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
      "vendorCustomView",
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
      getVendorCustomView({
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
      "vendorCustomView",
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
      getVendorList({
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


export const useInfiniteVendors = (params) => {
  return useInfiniteQuery({
    queryKey: ["vendorCustomView", params],
    queryFn: ({ pageParam = 1 }) =>
      getVendorCustomView({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },

    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};

export const useDeleteVendor = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteVendor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorCustomView"] });
    },
  });
};

export const useGetVendorInfo = (id) => {
  return useQuery({
    queryKey: ["vendor", id],
    queryFn: () => getVendorDetails({ id }),
    keepPreviousData: true,
    enabled: !!id,
  });
};

export const useVendorCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: vendorCreate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorCustomView"] });
    },
  });
};

export const useUpdateVendorById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ vendorId, data }) => updateVendorById(vendorId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendor"] });
      queryClient.invalidateQueries({ queryKey: ["vendorCustomView"] });
    },
  });
};


export const useBulkDeleteVendors = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: bulkDeleteVendors,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorCustomView"] });
    },
  });
};

//


/* Add note */
export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNote,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["vendorNotes"],
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
      queryClient.invalidateQueries({ queryKey: ["vendorNotes"] });
    },
  });
};

/* Delete note */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorNotes"] });
    },
  });
};

/* Get note by ID */
export const useClientNoteById = ({ id }) => {
  return useQuery({
    queryKey: ["vendorNotes", id],
    queryFn: () => getNoteById({ id }),
    enabled: !!id,
  });
};

/* Get all notes */
export const useVendorNotes = ({ vendorId }) => {
  return useQuery({
    queryKey: ["vendorNotes", vendorId],
    queryFn: () => getAllNotes({ vendorId }),
    enabled: !!vendorId,
  });
};


export const useUpdateBillingShippingAddress = () => {
  return useMutation({
    mutationFn: updateBillingShippingAddress,
  });
};
