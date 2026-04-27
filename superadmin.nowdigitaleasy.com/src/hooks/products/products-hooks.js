import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getAllPlans,
  addPlan,
  updatePlan,
  deletePlan,
  getPlanPricings,
  updatePlanPricing,
  updateProductStatus,
  getPlanById,
  getPlanBillingCycles,
  getBillingCycles,
  getPlanPriceDiscount,
  updatePlanPriceDiscount,
  uploadPlanProfile,
  removePlanProfile,
  clonePlan,
  getPlanConfigById,
  updateHostingConfig,
  getPriceVariants,
  getTaxList,
  getTaxesById,
  getProductExists,
  deleteProductSuggestion,
  updateProductSuggestion,
  createProductSuggestion,
  getProductSuggestionList,
  updateProductSuggestionStatus,
} from "../../services/products/products-service";

export const useProducts = ({ type, page = 1, limit = 10, search, customFilters, filter }) => {
  return useQuery({
    queryKey: ["products", { type, page, limit, search, customFilters, filter }],
    queryFn: () => getAllProducts({ type, page, limit, search, customFilters, filter }),
    enabled: !!type || !!filter,
  });
};


export const useProductsDetails = ({type, filter, limit = 10, search, customFilters }) => {
  return useInfiniteQuery({
    queryKey: ["products", {type, filter, limit, search, customFilters }],
    queryFn: ({ pageParam = 1 }) =>
      getAllProducts({
        page: pageParam,
        limit,
        search,
        customFilters,
        filter,
        type
      }),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
    enabled: !!filter || !!type, 
  });
};

export const useTaxList = ({ taxType }) => {
  return useQuery({
    queryKey: ["tax_tds", taxType],
    queryFn: () => getTaxList({ taxType }),
  });
};

export const useTaxById = (id) => {
  return useQuery({
    queryKey: ["taxById", id],
    queryFn: () => getTaxesById(id),
    enabled: !!id,
  });
};

export const useProductById = (id) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, formData }) => updateProduct(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProductStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

// Product Plan

// Fetch all plans
export const usePlans = (type, productId) => {
  return useQuery({
    queryKey: ["plans", type, productId],
    queryFn: () => getAllPlans(type, productId),
    enabled: !!type, //&& !!productId
  });
};

export const usePlanById = (id, enabled = true) => {
  return useQuery({
    queryKey: ["planById", id],
    queryFn: () => getPlanById(id),
    enabled: !!id && enabled,
  });
};

// Add new plan
export const useAddPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["planById"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useClonePlan = (planId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => clonePlan({ planId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["planById", planId] });
    },
  });
};

// Update plan
export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => updatePlan(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["planById"] });
    },
  });
};

// Delete plan
export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const usePlanPricings = (planId, enabled = false) => {
  return useQuery({
    queryKey: ["plan-pricing", planId],
    queryFn: () => getPlanPricings(planId),
    enabled: enabled,
  });
};

export const useUpdatePlanPricing = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlanPricing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan-pricing"] });
      queryClient.invalidateQueries({ queryKey: ["billingCycles"] });
      queryClient.invalidateQueries({ queryKey: ["plans"] });
    },
  });
};

export const usePlanBillingCycles = ({ type, enabled = true }) => {
  return useQuery({
    queryKey: ["planBillingCycles", type],
    queryFn: () => getPlanBillingCycles(type),
    enabled: Boolean(type) && enabled,
  });
};

export const useBillingCycles = ({ plan_id, currency_id }) => {
  return useQuery({
    queryKey: ["billingCycles", plan_id, currency_id],
    queryFn: () => getBillingCycles({ plan_id, currency_id }),
    enabled: !!plan_id && !!currency_id,
  });
};

export const usePlanPriceDiscount = ({ plan_id, currency_id, billing }) => {
  return useQuery({
    queryKey: ["planPriceDiscount", plan_id, currency_id, billing],
    queryFn: () => getPlanPriceDiscount({ plan_id, currency_id, billing }),
    enabled: !!plan_id && !!currency_id && !!billing,
  });
};

export const useUpdatePlanPriceDiscount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePlanPriceDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["planPriceDiscount"] });
    },
  });
};

export const useUploadPlanProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadPlanProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["planById"] });
    },
  });
};

export const useRemovePlanProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removePlanProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] });
      queryClient.invalidateQueries({ queryKey: ["planById"] });
    },
  });
};

export const usePlanConfigById = (planId) => {
  return useQuery({
    queryKey: ["planConfig", planId],
    queryFn: () => getPlanConfigById(planId),
    enabled: !!planId,
  });
};

export const useUpdateHostingConfig = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHostingConfig,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      });
    },
  });
};

export const usePriceVariants = (currencyId) => {
  return useQuery({
    queryKey: ["priceVariants", currencyId],
    queryFn: () => getPriceVariants(currencyId),
    enabled: !!currencyId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useProductExists = ({ type, enabled = true }) => {
  return useQuery({
    queryKey: ["productExist", type],
    queryFn: () => getProductExists(type),
    enabled: Boolean(type) && enabled,
  });
};


// product-suggestion

export const useProductSuggestionList = () => {
  return useQuery({
    queryKey: ["productSuggestionList"],
    queryFn: getProductSuggestionList,
  });
};


export const useCreateProductSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProductSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries(["productSuggestionList"]);
    },
  });
};

export const useUpdateProductSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ productId, data,suggestionId }) => updateProductSuggestion(productId, data,suggestionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["productSuggestionList"]);
    },
  });
};

export const useDeleteProductSuggestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductSuggestion,
    onSuccess: () => {
      queryClient.invalidateQueries(["productSuggestionList"]);
    },
  });
};

export const useUpdateProductSuggestionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProductSuggestionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productSuggestionList"] });
    },
  });
};