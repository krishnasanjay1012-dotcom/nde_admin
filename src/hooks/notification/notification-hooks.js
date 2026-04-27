import { useQuery,useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, updateNotification } from "../../services/notification/notification-service";

export const useNotifications = ({ page = 1, limit = 20,}) => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications({ page , limit }),
    keepPreviousData: true,
    refetchInterval: 10000, // 10 seconds
    refetchIntervalInBackground: true, // optional: continues even if window is not focused
  });
};


export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
};
