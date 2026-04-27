import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getSubscriptionById, getSubscriptions, getSubscriptionsUser } from "../../services/subscription/subscription-service";

export const useSubscriptionUser = () => {
  return useQuery({
    queryKey: ["subscriptionUser"],
    queryFn: getSubscriptionsUser,
  });
};

export const useSubscriptions = (params) => {
  return useQuery({
    queryKey: ["subscriptions", params],
    queryFn: () => getSubscriptions(params),
    enabled: params?.filter !== null &&  params?.filter !== undefined,

  });
};

export const useInfiniteSubscriptions = (params) => {
  return useInfiniteQuery({
    queryKey: ["subscriptions", params],
    queryFn: ({ pageParam = 1 }) =>
      getSubscriptions({ ...params, page: pageParam }),

    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage ?? undefined;
    },

    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};


export const useSubscriptionById = (id) => {
  return useQuery({
    queryKey: ["subscription", id],
    queryFn: () => getSubscriptionById(id),
    enabled: !!id,
  });
};