import { useQuery,useMutation, useQueryClient} from "@tanstack/react-query";
import { getAllProductGroups } from "../../services/domain/domain-service";
import { addSuite, bulkDeleteApps, createApp, createPlan, createSuitePlan, deleteApp, deleteAppProduct, deleteSuite, deleteSuitePlan, getAllSuites, getAppPrice, getAppProducts, getApps, getPlansByProductId, getSuitePlanById, updateAppById, updatePlan, updatePlanPrice, updateSuite, updateSuitePlan } from "../../services/application/application-service";

export const useApps = () => {
  return useQuery({
    queryKey: ["apps"],
    queryFn: getApps,
    staleTime: 5 * 60 * 1000,
  });
};

export const useAppProducts = ({ searchTerm, isAscending }) => {
  return useQuery({
    queryKey: ["appProducts", { searchTerm, isAscending }],
    queryFn: () => getAppProducts({ searchTerm, isAscending }),
    staleTime: 5 * 60 * 1000,
  });
};


export const useCreateApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};
export const usePlansByProduct = (productId) => {
  return useQuery({
    queryKey: ["apps", "plans", productId],
    queryFn: () => getPlansByProductId(productId),
    enabled: !!productId,
  });
};
export const useUpdateApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appId, data }) => updateAppById(appId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};

export const useProductGroups = () => {
  return useQuery({
    queryKey: ["productGroups"],
    queryFn: getAllProductGroups,
    staleTime: 5 * 60 * 1000, 
  });
};

export const useAppPrice = ({ plan, product }) => {
  return useQuery({
    queryKey: ["appPrice", plan, product],
    queryFn: () => getAppPrice({ plan, product }),
    enabled: !!plan && !!product, 
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdatePlanPrice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlanPrice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appPrice"] });
    },
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};

export const useDeleteAppProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAppProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};

export const useDeleteApps = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => bulkDeleteApps(ids), 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};

export const useDeleteApp = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appProducts"] });
    },
  });
};

// Suites

export const useAddSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addSuite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suites"] }); 
    },
  });
};

export const useDeleteSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSuite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suites"] });
    },
  });
};

export const useAllSuites = () => {
  return useQuery({
    queryKey: ["suites"],
    queryFn: getAllSuites,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSuite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSuite(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suites"] }); 
    },
  });
};

export const useDeleteSuitePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteSuitePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suitePlan"] });
    },
  });
};

export const useCreateSuitePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSuitePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suitePlan"] }); 
    },
  });
};

export const useSuitePlanById = (id) => {
  return useQuery({
    queryKey: ["suitePlan", id],
    queryFn: () => getSuitePlanById(id),
    enabled: !!id, 
    staleTime: 5 * 60 * 1000, 
  });
};

export const useUpdateSuitePlan = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateSuitePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suitePlan"] }); 
    },
  });
};