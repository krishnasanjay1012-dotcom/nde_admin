import {
  CHART,
  TOTAL_AMOUNT_BY_MONTH,
  DAILY_DATA,
  PRODUCT_DATA,
  TOTAL_DOMAIN,
  TOTAL_CLIENTS,
  USER_COUNT,
  ORDER_COUNT,
  TOTAL_GSUITE,
  TOTAL_HOSTING,
  TOTAL_PAID_INVOICE,
  TOTAL_SALES,
  OVERDUE_COUNT,
  ACTIVITY_LOG,
  CUSTOMER_DETAILS,
  OVERVIEW_CURRENCY_LIST,
} from "../endpoints";
import { apiGet } from "../axios-instance";

// Charts
export const getAllCharts = () => {
  return apiGet(CHART);
};
export const getTotalDomain = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(TOTAL_DOMAIN, filter);
};

export const getTotalClients = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];

  return apiGet(TOTAL_CLIENTS, filter);
};

export const getUserCount = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(USER_COUNT, filter);
};

export const getOrderCount = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(ORDER_COUNT, filter);
};

export const getTotalGsuite = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(TOTAL_GSUITE, filter);
};

export const getTotalHosting = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(TOTAL_HOSTING, filter);
};

export const getTotalPaidInvoice = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(TOTAL_PAID_INVOICE, filter);
};

export const getTotalSales = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(TOTAL_SALES, filter);
};

export const getOverdueCount = ({ queryKey }) => {
  const { ...filter } = queryKey?.[1];
  return apiGet(OVERDUE_COUNT, filter);
};

// Total amount by month
export const getTotalAmountByMonth = (year, targetCurrency) => {
  return apiGet(
    `${TOTAL_AMOUNT_BY_MONTH}?year=${year}&targetCurrency=${targetCurrency || ""}`,
  );
};

// Daily Data
export const getDailyData = ({
  date_filter,
  start_date,
  end_date,
  page,
  limit,
}) => {
  return apiGet(
    `${DAILY_DATA}?date_filter=${date_filter || ""}&start_date=${start_date || ""}&end_date=${end_date || ""}&page=${page || 1}&limit=${limit || 10}`,
  );
};

// Product Data
export const getProductData = ({
  custom,
  date_filter,
  start_date,
  end_date,
  page,
  limit,
}) => {
  return apiGet(
    `${PRODUCT_DATA}?custom=${custom}&date_filter=${date_filter || ""}&start_date=${start_date || ""}&end_date=${end_date || ""}&page=${page || 1}&limit=${limit || 10}`,
  );
};

export const getActivityLog = ({ userId, page, limit }) => {
  return apiGet(
    `${ACTIVITY_LOG}?userId=${userId}&page=${page || 1}&limit=${limit || 10}`,
  );
};

export const getCustomerInfo = (userId) => {
  return apiGet(`${CUSTOMER_DETAILS}/${userId}`);
};

export const getCurrencyList = () => {
  return apiGet(`${OVERVIEW_CURRENCY_LIST}`);
};
