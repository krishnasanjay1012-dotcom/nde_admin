import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTld,
  updateTld,
  getTldById,
  deleteTld,
} from "../../services/domain/domain-service";

export const useTldById = ({ id }) => {
  return useQuery({
    queryKey: ["tld", id],
    queryFn: () => getTldById({ id }),
    enabled: !!id,
  });
};

export const useAddTld = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTld,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tlds"] });
    },
  });
};

export const useUpdateTld = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTld,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tlds"] });
    },
  });
};

export const useDeleteTld = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTld,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tlds"] });
    },
  });
};
