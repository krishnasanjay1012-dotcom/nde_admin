import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  getAllNotes,
  getNoteById,
  addNote,
  updateNote,
  deleteNote,
} from "../../services/comments/comments-service";

/* Get all notes */
export const useClientNotes = ({ userId }) => {
  return useQuery({
    queryKey: ["clientNotes", userId],
    queryFn: () => getAllNotes({ userId }),
    enabled: !!userId,
  });
};

/* Get note by ID */
export const useClientNoteById = ({ id }) => {
  return useQuery({
    queryKey: ["clientNote", id],
    queryFn: () => getNoteById({ id }),
    enabled: !!id,
  });
};

/* Add note */
export const useAddNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addNote,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientNotes", variables.customerId],
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
      queryClient.invalidateQueries({ queryKey: ["clientNotes"] });
    },
  });
};

/* Delete note */
export const useDeleteNote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clientNotes"] });
    },
  });
};