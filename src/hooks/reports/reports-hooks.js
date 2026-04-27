import { useQuery } from "@tanstack/react-query";
import { getAppsProductList, getDomainProductList, getGsuiteProductList, getPleskProductList, getPurchasedProductList } from "../../services/reports/reports-service";

export const useGsuiteProductList = (params) => {
  return useQuery({
    queryKey: ["gsuiteProductList", params],
    queryFn: () => getGsuiteProductList(params),
  });
};

export const useDomainProductList = (params) => {
  return useQuery({
    queryKey: ["domainProductList", params],
    queryFn: () => getDomainProductList(params),
  });
};

export const usePleskProductList = (params) => {
  return useQuery({
    queryKey: ["pleskProductList", params],
    queryFn: () => getPleskProductList(params),
  });
};

export const useAppsProductList = (params) => {
  return useQuery({
    queryKey: ["appsProductList", params],
    queryFn: () => getAppsProductList(params),
  });
};


export const usePurchasedProductList = (params) => {
  return useQuery({
    queryKey: ["appsProductList", params],
    queryFn: () => getPurchasedProductList(params),
    enabled: params?.filter !== null && params?.filter !== undefined,
  });
};