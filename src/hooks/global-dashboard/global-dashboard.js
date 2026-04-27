import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getComponent,
  getComponentPreviewDetails,
  getDashboardChartCard,
  getDashboardContentList,
  getDashboardKPICard,
  getDashboardTargetCard,
  getFields,
  getModules,
} from "../../services/global-dashboard/global-dashboard";

//  KPI List
export const useDashboardContentList = () => {
  return useQuery({
    queryKey: ["getDashboardContentList"],
    queryFn: getDashboardContentList,
  });
};
export const useDashboardKPICard = ({ id }) => {
  return useQuery({
    queryKey: [`getDashboardKPICard-${id}`, { id }],
    queryFn: getDashboardKPICard,
    enabled: !!id,
  });
};
export const useDashboardChartCard = ({ id }) => {
  return useQuery({
    queryKey: [`getDashboardChartCard-${id}`, { id }],
    queryFn: getDashboardChartCard,
    enabled: !!id,
  });
};
export const useDashboardTargetCard = ({ id }) => {
  return useQuery({
    queryKey: [`getDashboardTargetCard-${id}`, { id }],
    queryFn: getDashboardTargetCard,
    enabled: !!id,
  });
};
//   Modules
export const useModules = () => {
  return useQuery({
    queryKey: ["getModules"],
    queryFn: getModules,
  });
};

//  Fields
export const useFields = ({ module }) => {
  return useQuery({
    queryKey: ["getFields", { module }],
    queryFn: getFields,
    enabled: !!module,
  });
};

//  get component by id and module
export const useGetComponent = ({ module, id, enabled }) => {
  return useQuery({
    queryKey: ["getComponent", { module, id }],
    queryFn: getComponent,
    enabled: enabled,
  });
};

//  get component preview data by id and module
export const useGetComponentPreviewDetails = (params) => {
  return useInfiniteQuery({
    queryKey: ["getComponentPreviewDetails", params],

    queryFn: getComponentPreviewDetails,

    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.page < lastPage?.pagination?.totalPages
        ? lastPage.pagination.page + 1
        : undefined,

    getPreviousPageParam: (firstPage) =>
      firstPage?.pagination?.page > 1
        ? firstPage.pagination.page - 1
        : undefined,

    enabled: params.enabled,
  });
};
