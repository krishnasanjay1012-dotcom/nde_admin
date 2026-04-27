import { Box } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import CommonDrawer from "../../../../components/common/NDE-Drawer";
import {
  createComponent,
  EditComponent,
} from "../../../../services/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../../Components/DashboardLoader";
import {
  CHARTS,
  KPI,
  TARGET_METERS,
} from "../Create/components/data/configureData";
import CreateComponent from "../Create/CreateComponent";
import ComponentTypeList from "./ComponentTypeList";

export default function SideBarDrawer({
  open,
  handleDrawer,
  componentType,
  setComponentType,
  setComponentCreateData,
  componentCreateData,
  isComponentDetailsLoading = false,
}) {
  const queryClient = useQueryClient();
  const [btnDisable, setBtnDisable] = useState(false);
  const label = componentCreateData?.key
    ? [KPI, TARGET_METERS, CHARTS]
        .flat()
        .find((i) => i?.key === componentCreateData.key)?.props?.data?.metric
        ?.label || "Component Library"
    : "Component Library";

  const { mutate: createMutate, isPending: createIsPending } = useMutation({
    mutationFn: (data) => {
      if (componentCreateData?.id) {
        return EditComponent({
          component_type: componentType,
          ...data,
          id: componentCreateData.id,
        });
      }
      return createComponent({ component_type: componentType, ...data });
    },

    mutationKey: ["createComponent"],
    onSuccess: () => {
      handleDrawer();
      queryClient.invalidateQueries(["getDashboardContentList"]);
    },
  });

  const handleSubmit = () => {
    if (componentType === "kpi") {
      const { criteriaFilter, key, ...rest } = componentCreateData || {};
      const allowedMap = {
        kpi_basic: ["name", "kpiMetric", "filters", "duration", "category"],
        kpi_growth: [
          "name",
          "kpiMetric",
          "filters",
          "duration",
          "category",
          "comparison",
        ],
        kpi_standard: [
          "name",
          "kpiMetric",
          "filters",
          "duration",
          "category",
          "comparison",
        ],
        kpi_scorecard: [
          "name",
          "kpiMetric",
          "filters",
          "duration",
          "category",
          "comparison",
          "rankConfig",
        ],
        kpi_rankings: [
          "name",
          "kpiMetric",
          "filters",
          "duration",
          "category",
          "rankConfig",
        ],
      };

      let modified = {
        ...rest,
        category: key,
        filters:
          criteriaFilter?.map((i) => ({
            value: i?.value,
            type: i?.type,
            operator: i?.condition,
            field: i?.field,
          })) || [],
      };

      if (allowedMap[key]) {
        modified = Object.fromEntries(
          Object.entries(modified).filter(([k]) => allowedMap[key].includes(k)),
        );
      }
      createMutate(modified);
    }
    if (componentType === "target") {
      const { criteriaFilter, key, ...rest } = componentCreateData || {};
      const allowedMap = {
        dial_gauge: [
          "name",
          "module",
          "metric",
          "filters",
          "duration",
          "type",
          "targetValue",
        ],
        single_bar: [
          "name",
          "module",
          "metric",
          "filters",
          "duration",
          "type",
          "targetValue",
        ],
        traffic_lights: [
          "name",
          "module",
          "metric",
          "filters",
          "duration",
          "type",
          "targetValue",
          "thresholds",
        ],
      };

      let modified = {
        ...rest,
        type: key,

        filters:
          criteriaFilter?.map((i) => ({
            value: i?.value,
            type: i?.type,
            operator: i?.condition,
            field: i?.field,
          })) || [],
      };

      if (allowedMap[key]) {
        modified = Object.fromEntries(
          Object.entries(modified).filter(([k]) => allowedMap[key].includes(k)),
        );
      }
      createMutate(modified);
    }
    if (componentType === "chart") {
      const { criteriaFilter, key, ...rest } = componentCreateData || {};

      const allowedMap = {
        pie: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
        ],
        heatmap: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
          "grouping2",
        ],

        donut: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
        ],
        column: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
          "benchMark",
        ],
        bar: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
          "benchMark",
        ],
        line: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
          "benchMark",
        ],
        area: [
          "name",
          "module",
          "chartType",
          "measure",
          "filters",
          "sort",
          "maxGrouping",
          "grouping1",
          "grouping2",
          "benchMark",
        ],
      };

      let modified = {
        ...rest,
        chartType: key,

        filters:
          criteriaFilter?.map((i) => ({
            value: i?.value,
            type: i?.type,
            operator: i?.condition,
            field: i?.field,
          })) || [],
      };

      if (allowedMap[key]) {
        modified = Object.fromEntries(
          Object.entries(modified).filter(([k]) => allowedMap[key].includes(k)),
        );
      }
      createMutate(modified);
    }
  };

  useEffect(() => {
    const data = componentCreateData;

    let isDisabled = false;

    // ✅ Name
    if (!componentCreateData?.name?.trim()) {
      isDisabled = true;
    }

    if (componentType === "kpi") {
      // ✅ Module
      if (!data?.kpiMetric?.module) {
        isDisabled = true;
      }

      // ✅ Criteria
      if (data?.criteriaFilter?.length) {
        const hasInvalid = data.criteriaFilter.some((item) =>
          !item?.condition ||
          !item?.value ||
          ["isNotNull", "isNull"]?.includes(item?.condition)
            ? false
            : !item?.field,
        );
        if (hasInvalid) {
          isDisabled = true;
        }
      }

      // ✅ Duration
      const duration = data?.duration;

      if (duration?.rangeType === "custom") {
        if (!duration?.fromDate || !duration?.toDate) {
          isDisabled = true;
        }
      } else if (duration?.rangeType === "last") {
        if (!duration?.lastValue || !duration?.lastUnit) {
          isDisabled = true;
        }
      } else {
        if (!duration?.value) {
          isDisabled = true;
        }
      }

      // ✅ Comparison
      if (!["kpi_rankings", "kpi_basic"].includes(data?.key)) {
        if (!data?.comparison?.compareTo) {
          isDisabled = true;
        }

        if (!data?.comparison?.objective) {
          isDisabled = true;
        }

        if (data?.comparison?.compareTo === "custom") {
          if (!data?.comparison?.fromDate || !data?.comparison?.toDate) {
            isDisabled = true;
          }
        }
      }

      // ✅ Ranking
      if (["kpi_scorecard", "kpi_rankings"].includes(data?.key)) {
        if (!data?.rankConfig?.field || !data?.rankConfig?.limit) {
          isDisabled = true;
        }
      }
    }

    if (componentType === "target") {
      // ✅ Module
      if (!data?.module) {
        isDisabled = true;
      }

      // target
      if (!data?.targetValue) {
        isDisabled = true;
      }

      // ✅ Criteria
      if (data?.criteriaFilter?.length) {
        const hasInvalid = data.criteriaFilter.some((item) =>
          !item?.condition ||
          !item?.value ||
          ["isNotNull", "isNull"]?.includes(item?.condition)
            ? false
            : !item?.field,
        );
        if (hasInvalid) {
          isDisabled = true;
        }
      }

      // ✅ Duration
      const duration = data?.duration;

      if (duration?.rangeType === "custom") {
        if (!duration?.fromDate || !duration?.toDate) {
          isDisabled = true;
        }
      } else if (duration?.rangeType === "last") {
        if (!duration?.lastValue || !duration?.lastUnit) {
          isDisabled = true;
        }
      } else {
        if (!duration?.value) {
          isDisabled = true;
        }
      }
    }
    if (componentType === "chart") {
      // ✅ Module
      if (!data?.module) {
        isDisabled = true;
      }

      if (
        ["bar", "column", "area", "line", "donut", "pie", "heatmap"]?.includes(
          data?.key,
        )
      ) {
        if (!data?.measure?.value) {
          isDisabled = true;
        }
        if (!componentCreateData?.grouping1?.value) {
          isDisabled = true;
        }
        if (
          !componentCreateData?.grouping2?.value &&
          ["area", "heatmap"]?.includes(data?.key)
        ) {
          isDisabled = true;
        }
      }

      // ✅ Criteria
      if (data?.criteriaFilter?.length) {
        const hasInvalid = data.criteriaFilter.some((item) =>
          !item?.condition ||
          !item?.value ||
          ["isNotNull", "isNull"]?.includes(item?.condition)
            ? false
            : !item?.field,
        );
        if (hasInvalid) {
          isDisabled = true;
        }
      }
    }

    setBtnDisable(isDisabled);
  }, [componentCreateData, componentType]);

  return (
    <CommonDrawer
      actions={
        componentCreateData?.key
          ? [
              {
                variant: "outlined",
                sx: {
                  height: "38px",
                  width: "100px",
                },

                disabled: createIsPending,
                onClick: handleDrawer,
                label: "Cancel",
              },
              {
                variant: "contained",
                sx: {
                  height: "38px",
                  width: "120px",
                },
                loading: createIsPending,
                disabled: btnDisable,
                onClick: handleSubmit,
                label: createIsPending ? "Creating" : "Save",
              },
            ]
          : []
      }
      children={
        <>
          {" "}
          {isComponentDetailsLoading && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <AnalyticsLoader size={4} />
            </Box>
          )}
          {!componentType && !isComponentDetailsLoading && (
            <ComponentTypeList
              componentType={componentType}
              setComponentType={setComponentType}
            />
          )}
          {componentType && !isComponentDetailsLoading && (
            <CreateComponent
              componentType={componentType}
              componentCreateData={componentCreateData}
              setComponentCreateData={setComponentCreateData}
              handleDrawer={handleDrawer}
            />
          )}
        </>
      }
      open={open}
      onClose={handleDrawer}
      width={{
        xs: "100vw",
        sm: "100vw",
        md: componentType ? "100vw" : 380,
        lg: componentType ? 1150 : 380,
      }}
      title={componentCreateData?.id ? "Edit Component" : label}
    />
  );
}
