import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import {
  getAllCharts,
  getTotalDomain,
  getTotalClients,
  getUserCount,
  getOrderCount,
  getTotalGsuite,
  getTotalHosting,
  getTotalPaidInvoice,
  getTotalSales,
  getOverdueCount,
  getTotalAmountByMonth,
  getDailyData,
  getProductData,
  getActivityLog,
  getCustomerInfo,
} from "../../services/dashboard/dashboard-service";

// Charts data
export const useCharts = () => {
  return useQuery({
    queryKey: ["charts"],
    queryFn: getAllCharts,
    // staleTime: 1000 * 60 * 5,
  });
};

// COUNTS
export const useTotalDomain = (filter) =>
  useQuery({
    queryKey: ["total-domain", filter],
    queryFn: getTotalDomain,
    // staleTime: 1000 * 60 * 5,
  });

export const useTotalClients = (filter) =>
  useQuery({
    queryKey: ["totalclients", filter],
    queryFn: getTotalClients,
    // staleTime: 1000 * 60 * 5,
  });

export const useUserCount = (filter) =>
  useQuery({
    queryKey: ["usercount", filter],
    queryFn: getUserCount,
  });

export const useOrderCount = (filter) =>
  useQuery({
    queryKey: ["ordercount", filter],
    queryFn: getOrderCount,
    // staleTime: 1000 * 60 * 5,
  });

export const useTotalGsuite = (filter) =>
  useQuery({
    queryKey: ["total-gsuite", filter],
    queryFn: getTotalGsuite,
    // staleTime: 1000 * 60 * 5,
  });

export const useTotalHosting = (filter) =>
  useQuery({
    queryKey: ["total-hosting", filter],
    queryFn: getTotalHosting,
    // staleTime: 1000 * 60 * 5,
  });

export const useTotalPaidInvoice = (filter) =>
  useQuery({
    queryKey: ["total-paid-invoice", filter],
    queryFn: getTotalPaidInvoice,
    // staleTime: 1000 * 60 * 5,
  });

export const useTotalSales = (filter) =>
  useQuery({
    queryKey: ["totalsales", filter],
    queryFn: getTotalSales,
    // staleTime: 1000 * 60 * 5,
  });

export const useOverdueCount = (filter) =>
  useQuery({
    queryKey: ["overduecount", filter],
    queryFn: getOverdueCount,
    // staleTime: 1000 * 60 * 5,
  });

// Total Amount by Month (needs params)
export const useTotalAmountByMonth = (year, currency) => {
  return useQuery({
    queryKey: ["totalAmountByMonth", year, currency],
    queryFn: () => getTotalAmountByMonth(year, currency),
    enabled: !!year && !!currency,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDailyData = ({
  date_filter,
  start_date,
  end_date,
  page = 1,
  limit = 10,
}) => {
  return useQuery({
    queryKey: ["dailyData", { date_filter, start_date, end_date, page, limit }],
    queryFn: () =>
      getDailyData({ date_filter, start_date, end_date, page, limit }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useProductData = ({
  custom = "",
  date_filter = "",
  start_date = "",
  end_date = "",
  page = 1,
  limit = 10,
}) => {
  return useQuery({
    queryKey: [
      "productData",
      { custom, date_filter, start_date, end_date, page, limit },
    ],
    queryFn: () =>
      getProductData({
        custom,
        date_filter,
        start_date,
        end_date,
        page,
        limit,
      }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};

export const useActivityLog = ({ page = 1, limit = 10, userId }) => {
  return useInfiniteQuery({
    queryKey: ["activitLog", userId],
    queryFn: () => getActivityLog({ page, limit, userId }),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.nextPage : undefined,
  });
};

export const useGetCustomerInfo = (userId) => {
  return useQuery({
    queryKey: ["customerInfo"],
    queryFn: () => getCustomerInfo(userId),
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
  });
};
