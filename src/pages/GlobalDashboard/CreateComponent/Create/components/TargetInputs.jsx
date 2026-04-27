import React, { useMemo } from "react";
import {
  CommonDatePicker,
  CommonSelect,
  CommonTextField,
} from "../../../../../components/common/fields";
import CriteriaFilter from "./CriteriaFilter/CriteriaFilter";
import {
  useFields,
  useModules,
} from "../../../../../hooks/global-dashboard/global-dashboard";
import { Box, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";

export default function TargetInputs({
  FieldRow,
  componentCreateData,
  setComponentCreateData,
}) {
  const theme = useTheme();
  // modules
  const { data: modules, isLoading: isFetchingTargetModules } = useModules();

  // fields
  const { data: fields, isLoading: isFetchingTargetFields } = useFields({
    module: componentCreateData?.module,
  });

  const criteriaFilters = useMemo(() => {
    const data = fields?.filters || [];

    return data?.map((item) => ({
      ...item,
      value: item?.field,
    }));
  }, [fields?.filters]);

  const TargetMetricList = useMemo(() => {
    const data = fields?.metricFields || [];

    return data.flatMap((item) => {
      return item?.allowedAggregations?.map((agg) => ({
        field: item?.field,
        label: `${agg?.charAt()?.toUpperCase()}${agg?.slice(1)} of ${item.label}`,
        value: `${item.field}_${agg}`,
        dataType: item?.dataType,
        aggregation: agg,
      }));
    });
  }, [fields?.metricFields]);

  const durationList = useMemo(() => {
    const data = fields?.durationFields || [];

    return data.flatMap((item) => {
      return item?.supportedDurations?.map((agg) => ({
        field: item?.field,
        label: `${item.label} - ${agg?.charAt()?.toUpperCase()}${agg?.slice(1)?.replaceAll("_", " ")}`,
        value: `${item.field}_${agg}`,
        dataType: item?.dataType,
        aggregation: agg,
      }));
    });
  }, [fields?.durationFields]);

  return (
    <>
      <FieldRow label={"Module"} maxWidth={"100%"} required={true}>
        <CommonSelect
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            height: "40px",
          }}
          loading={isFetchingTargetModules}
          placeholder="Select"
          value={componentCreateData?.module}
          options={modules}
          disabled={isFetchingTargetModules}
          onChange={(e) =>
            setComponentCreateData({
              key: componentCreateData?.key,
              module: e.target.value,
              name: componentCreateData?.name,
              ...(componentCreateData?.id
                ? { id: componentCreateData?.id }
                : {}),

              ...(componentCreateData?.key === "traffic_lights"
                ? {
                    thresholds: {
                      firstPercent: 30,
                      secondPercent: 60,
                    },
                  }
                : {}),
            })
          }
          searchable
        />
      </FieldRow>
      {componentCreateData?.module && (
        <>
          <FieldRow label={"Target metric"} maxWidth={"100%"} required={true}>
            <CommonSelect
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                height: "40px",
              }}
              disabled={isFetchingTargetFields}
              loading={isFetchingTargetFields}
              value={componentCreateData?.metric?.value}
              options={TargetMetricList}
              onChange={(e) => {
                let selected = TargetMetricList?.find(
                  (i) => i?.value === e.target.value,
                );
                setComponentCreateData({
                  ...componentCreateData,
                  module: componentCreateData?.module,
                  metric: {
                    aggregation: selected?.aggregation,
                    dataType: selected?.dataType,
                    label: selected?.label,
                    field: selected?.field,
                    value: e.target.value,
                  },
                });
              }}
              searchable
            />
          </FieldRow>
          <FieldRow label={"Duration"} maxWidth={"100%"} required={true}>
            <CommonSelect
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: 2,

                height: "40px",
              }}
              disabled={isFetchingTargetFields}
              loading={isFetchingTargetFields}
              value={componentCreateData?.duration?.value}
              options={durationList}
              onChange={(e) => {
                let selected = durationList?.find(
                  (i) => i?.value === e.target.value,
                );
                setComponentCreateData({
                  ...componentCreateData,
                  comparison: {
                    compareTo: ["last", "custom"]?.includes(
                      selected?.aggregation,
                    )
                      ? "custom"
                      : "",
                  },
                  duration: {
                    dateField: selected?.field,
                    rangeType: selected?.aggregation,
                    ...(selected?.aggregation === "last"
                      ? { lastValue: 0, lastUnit: "day" }
                      : {}),
                    ...(selected?.aggregation === "custom"
                      ? { fromDate: null, toDate: null }
                      : {}),
                    value: e.target.value,
                  },
                });
              }}
              searchable
            />
          </FieldRow>
          {/* duration last */}
          {componentCreateData?.duration?.rangeType === "last" && (
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <FieldRow label={"Last"} maxWidth={"300px"} required={true}>
                <CommonTextField
                  value={componentCreateData?.duration?.lastValue}
                  onChange={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      duration: {
                        ...componentCreateData?.duration,
                        lastValue: e.target.value.replace(/[^0-9]/g, ""),
                      },
                    })
                  }
                  onBlur={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      duration: {
                        ...componentCreateData?.duration,
                        lastValue: 0 < e.target.value ? e.target.value : 0,
                      },
                    })
                  }
                  width="200px"
                  type="number"
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  placeholder={"Enter value (number)"}
                  // helperText={"error"}
                  // error={true}
                  inputProps={{ max: 999, min: 0 }}
                />
              </FieldRow>
              <CommonSelect
                width="200px"
                sx={{
                  bgcolor: theme.palette.background.default,
                  height: "40px",
                  borderRadius: 2,
                }}
                value={componentCreateData?.duration?.lastUnit}
                options={[
                  { label: "day(s)", value: "day" },
                  { label: "week(s)", value: "week" },
                  ,
                  { label: "month(s)", value: "month" },
                  ,
                  { label: "year(s)", value: "year" },
                ]}
                onChange={(e) => {
                  setComponentCreateData({
                    ...componentCreateData,
                    duration: {
                      ...componentCreateData?.duration,
                      lastUnit: e.target.value,
                    },
                  });
                }}
                searchable
              />
            </Box>
          )}
          {/* duration custom */}
          {componentCreateData?.duration?.rangeType === "custom" && (
            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
              <FieldRow label={"From"} maxWidth={"150px"} required={true}>
                <CommonDatePicker
                  value={componentCreateData?.duration?.fromDate}
                  onChange={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      duration: {
                        ...componentCreateData?.duration,
                        fromDate: e.target.value,
                        toDate: null,
                      },
                    })
                  }
                  sx={{
                    "& .MuiPickersOutlinedInput-root": {
                      height: "40px",
                      borderRadius: 2,
                      bgcolor: theme.palette.background.default,
                    },
                    "& fieldset": {
                      height: "45px",
                      padding: 0,
                      margin: 0,
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: "20px",
                    },
                  }}
                />
              </FieldRow>
              <FieldRow
                label={"To"}
                labelWidth={"50px"}
                maxWidth={"150px"}
                required={true}
              >
                <CommonDatePicker
                  minDate={
                    componentCreateData?.duration?.fromDate
                      ? dayjs(componentCreateData?.duration?.fromDate).add(
                          1,
                          "day",
                        )
                      : ""
                  }
                  value={componentCreateData?.duration?.toDate}
                  onChange={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      duration: {
                        ...componentCreateData?.duration,
                        toDate: e.target.value,
                      },
                    })
                  }
                  sx={{
                    "& .MuiPickersOutlinedInput-root": {
                      height: "40px",
                      borderRadius: 2,
                      bgcolor: theme.palette.background.default,
                    },
                    "& fieldset": {
                      height: "45px",
                      padding: 0,
                      margin: 0,
                    },
                    "& .MuiSvgIcon-root": {
                      fontSize: "20px",
                    },
                  }}
                />
              </FieldRow>
            </Box>
          )}
          <CriteriaFilter
            criteriaFiltersFields={criteriaFilters}
            data={componentCreateData?.criteriaFilter ?? []}
            setData={(data) =>
              setComponentCreateData({
                ...componentCreateData,
                criteriaFilter: data,
              })
            }
          />

          <FieldRow label={"Target"} maxWidth={"100%"} required={true}>
            <CommonTextField
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                height: "40px",
              }}
              type={"number"}
              value={componentCreateData?.targetValue}
              onChange={(e) =>
                setComponentCreateData({
                  ...componentCreateData,
                  targetValue:
                    e.target.value.replace(/\D/g, "") <= 99999999999999
                      ? e.target.value.replace(/\D/g, "")
                      : 99999999999999,
                })
              }
              placeholder={"Enter Target Value"}
              minWidth={"300px"}
              // helperText={"error"}
              // error={true}

              slotProps={{
                htmlInput: {
                  max: 99999999999999,
                  min: 1,
                },
              }}
            />
          </FieldRow>
        </>
      )}
    </>
  );
}
