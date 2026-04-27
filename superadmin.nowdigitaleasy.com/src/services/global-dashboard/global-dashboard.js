import { DASHBOARD } from "../endpoints";

import { apiDelete, apiGetParams, apiPost, apiUpdate } from "../axios-instance";

export const getDashboardContentList = async () => {
  try {
    const res = await apiGetParams(`${DASHBOARD}/widgets`);
    return res?.data;
  } catch {
    return [];
  }
};

export const EditDashboardPositionUpdate = async (data) => {
  const res = await apiUpdate(`${DASHBOARD}/widgets`, {
    dashboardWidgets: data,
  });
  return res;
};

export const getDashboardKPICard = async ({ queryKey }) => {
  const { id } = queryKey?.[1] || {};
  try {
    const res = await apiGetParams(`${DASHBOARD}/kpi/${id}/result`);
    return res;
  } catch {
    return [];
  }
};
export const getDashboardChartCard = async ({ queryKey }) => {
  const { id } = queryKey?.[1] || {};
  try {
    const res = await apiGetParams(`${DASHBOARD}/chart/${id}/result`);
    return res;
  } catch {
    return [];
  }
};
export const getDashboardTargetCard = async ({ queryKey }) => {
  const { id } = queryKey?.[1] || {};
  try {
    const res = await apiGetParams(`${DASHBOARD}/target/${id}/result`);
    return res;
  } catch {
    return [];
  }
};

export const getModules = async () => {
  try {
    const res = await apiGetParams(`${DASHBOARD}/kpi/modules`);
    return res?.data;
  } catch {
    return [];
  }
};

export const getFields = async ({ queryKey }) => {
  const { module } = queryKey?.[1] || {};
  try {
    const res = await apiGetParams(`${DASHBOARD}/kpi/modules/${module}/fields`);
    return res?.data;
  } catch {
    return {};
  }
};

export const getRefList = async ({ module, pageParam, search }) => {
  try {
    const res = await apiGetParams(`${DASHBOARD}/${module}`, {
      page: pageParam,
      search: search,
    });

    return res;
  } catch {
    return {};
  }
};

export const createComponent = async (data) => {
  const { component_type, ...rest } = data;
  const res = await apiPost(`${DASHBOARD}/${component_type}`, rest);
  return res;
};
export const EditComponent = async (data) => {
  const { component_type, id, ...rest } = data;
  const res = await apiUpdate(`${DASHBOARD}/${component_type}/${id}`, rest);
  return res;
};

export const deleteComponent = async ({ id, module }) => {
  const res = await apiDelete(`${DASHBOARD}/${module}/${id}`);
  return res;
};

export const getComponent = async ({ queryKey }) => {
  const { id, module } = queryKey?.[1] || {};

  const res = await apiGetParams(`${DASHBOARD}/${module}/${id}`);
  return res?.data;
};
export const getComponentPreviewDetails = async ({
  queryKey,
  pageParam = 1,
}) => {
  const {
    api,
    targetId,
    chartId,
    kpiId,
    module,
    groupValue1,
    groupValue2,
    groupValue,
    pageLimit,
  } = queryKey?.[1] || {};

  const res = await apiPost(`${DASHBOARD}/${module}/${api}`, {
    kpiId,
    chartId,
    groupValue1,
    groupValue2,
    groupValue,
    targetId,
    page: pageParam,
    limit: pageLimit,
  });
  return res;
};
