import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addRecaptcha, deleteRecaptcha, getAllRecaptcha, updateRecaptchaStatus } from "../../services/setting/recaptcha-service";

export const useAddRecaptcha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRecaptcha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recaptcha"] });
    },
  });
};

export const useGetAllRecaptcha = () => {
  return useQuery({
    queryKey: ["recaptcha"],
    queryFn: getAllRecaptcha,
  });
};

export const useUpdateRecaptchaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }) => updateRecaptchaStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recaptcha"] });
    },
  });
};

export const useDeleteRecaptcha = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteRecaptcha,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recaptcha"] });
    },
  });
};
