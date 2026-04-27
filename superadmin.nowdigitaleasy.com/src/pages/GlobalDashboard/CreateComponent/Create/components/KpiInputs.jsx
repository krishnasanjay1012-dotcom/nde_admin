import { Box, Typography, useTheme } from "@mui/material";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
  CommonDatePicker,
  CommonSelect,
  CommonTextField,
} from "../../../../../components/common/fields";
import {
  useFields,
  useModules,
} from "../../../../../hooks/global-dashboard/global-dashboard";
import CriteriaFilter from "./CriteriaFilter/CriteriaFilter";

export default function KpiInputs({
  FieldRow,
  componentCreateData,
  setComponentCreateData,
}) {
  const theme = useTheme();
  // modules
  const { data: modules, isLoading: isFetchingKpiModules } = useModules();

  // fields
  const { data: fields, isLoading: isFetchingKpiFields } = useFields({
    module: componentCreateData?.kpiMetric?.module,
  });

  const criteriaFilters = useMemo(() => {
    const data = fields?.filters || [];

    return data?.map((item) => ({
      ...item,
      value: item?.field,
    }));
  }, [fields?.filters]);

  const KpiMetricList = useMemo(() => {
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

  const rankList = useMemo(() => {
    const groupFields = fields?.groupFields ?? [];

    const withAggregation = [];
    const withoutAggregation = [];

    groupFields.forEach((item) => {
      const {
        supportedGroupBy = [],
        field,
        label,
        dataType,
        labelField,
        ref,
      } = item;

      if (supportedGroupBy.length) {
        supportedGroupBy.forEach((agg) => {
          withAggregation.push({
            field,
            label: `${label} - ${agg.charAt(0).toUpperCase()}${agg
              .slice(1)
              .replaceAll("_", " ")}`,
            value: `${field}_${agg}`,
            dataType,
            aggregation: agg,
            labelField: labelField,
            ref: ref,
          });
        });
      } else {
        withoutAggregation.push({
          field,
          label,
          value: field,
          dataType,
          labelField: labelField,
          ref: ref,
        });
      }
    });

    return [...withoutAggregation, ...withAggregation];
  }, [fields?.groupFields]);

  return (
    <>
      <FieldRow label={"Module"} maxWidth={"100%"} required={true}>
        <CommonSelect
          sx={{
            bgcolor: theme.palette.background.default,
            borderRadius: 2,
            height: "40px",
          }}
          loading={isFetchingKpiModules}
          placeholder="Select"
          value={componentCreateData?.kpiMetric?.module}
          options={modules}
          disabled={isFetchingKpiModules}
          onChange={(e) =>
            setComponentCreateData({
              name: componentCreateData?.name,
              key: componentCreateData?.key,
              ...(componentCreateData?.id
                ? { id: componentCreateData?.id }
                : {}),
              kpiMetric: { module: e.target.value },
            })
          }
          searchable
        />
      </FieldRow>
      {componentCreateData?.kpiMetric?.module && (
        <>
          <FieldRow label={"KPI metric"} maxWidth={"100%"} required={true}>
            <CommonSelect
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: 2,
                height: "40px",
              }}
              disabled={isFetchingKpiFields}
              loading={isFetchingKpiFields}
              value={componentCreateData?.kpiMetric?.value}
              options={KpiMetricList}
              onChange={(e) => {
                let selected = KpiMetricList?.find(
                  (i) => i?.value === e.target.value,
                );
                setComponentCreateData({
                  ...componentCreateData,
                  kpiMetric: {
                    module: componentCreateData?.kpiMetric?.module,
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
          {/* <Box sx={{ mt }}> */} {/* </Box> */}
          <FieldRow label={"Duration"} maxWidth={"100%"} required={true}>
            <CommonSelect
              sx={{
                bgcolor: theme.palette.background.default,
                borderRadius: 2,

                height: "40px",
              }}
              disabled={isFetchingKpiFields}
              loading={isFetchingKpiFields}
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

                  { label: "month(s)", value: "month" },

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
          {!["kpi_rankings", "kpi_basic"]?.includes(
            componentCreateData?.key,
          ) && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: "450" }}
                color="text.primary"
              >
                Comparison Indicator
              </Typography>
              <FieldRow label={"Compare To"} maxWidth={"100%"} required={true}>
                <CommonSelect
                  disabled={["custom", "last"]?.includes(
                    componentCreateData?.duration?.rangeType,
                  )}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.comparison?.compareTo}
                  options={[
                    {
                      value: "previous_period",
                      label: "Previous Period",
                    },
                    {
                      value: "previous_period_relative",
                      label: "Previous Period relative",
                    },
                    {
                      value: "same_period_last_year",
                      label: "Same period Last Year",
                    },
                    {
                      value: "custom",
                      label: "custom",
                    },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      comparison: {
                        compareTo: e.target.value,
                        objective: componentCreateData?.comparison?.objective,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              {componentCreateData?.comparison?.compareTo === "custom" && (
                <Box
                  sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}
                >
                  <FieldRow label={"From"} maxWidth={"150px"} required={true}>
                    <CommonDatePicker
                      value={componentCreateData?.comparison?.fromDate}
                      onChange={(e) =>
                        setComponentCreateData({
                          ...componentCreateData,
                          comparison: {
                            ...componentCreateData?.comparison,
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
                        componentCreateData?.comparison?.fromDate
                          ? dayjs(
                              componentCreateData?.comparison?.fromDate,
                            ).add(1, "day")
                          : ""
                      }
                      value={componentCreateData?.comparison?.toDate}
                      onChange={(e) =>
                        setComponentCreateData({
                          ...componentCreateData,
                          comparison: {
                            ...componentCreateData?.comparison,
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
              <FieldRow label={"Objective"} maxWidth={"100%"} required={true}>
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.comparison?.objective}
                  options={[
                    {
                      value: "positive",
                      label: "Consider increase in value as positive",
                    },
                    {
                      value: "negative",
                      label: "Consider increase in value as negative",
                    },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      comparison: {
                        ...componentCreateData?.comparison,
                        objective: e.target.value,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
            </Box>
          )}
          {["kpi_rankings", "kpi_scorecard"]?.includes(
            componentCreateData?.key,
          ) && (
            <Box sx={{ mt: 2 }}>
              <Typography
                sx={{ fontSize: "18px", fontWeight: "450" }}
                color="text.primary"
              >
                Rank
              </Typography>
              <FieldRow label={"Rank"} maxWidth={"100%"} required={true}>
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.rankConfig?.value}
                  options={rankList}
                  onChange={(e) => {
                    let selected = rankList?.find(
                      (i) => i?.value === e.target.value,
                    );
                    setComponentCreateData({
                      ...componentCreateData,
                      rankConfig: {
                        value: e.target.value,
                        field: selected?.field,
                        type: selected?.dataType,
                        ref: selected?.ref,
                        labelField: selected?.labelField,

                        limit: componentCreateData?.rankConfig?.limit,
                        ...(selected?.aggregation
                          ? { groupBy: selected?.aggregation }
                          : {}),
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>

              <FieldRow label={"Show"} maxWidth={"100%"} required={true}>
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.rankConfig?.limit}
                  options={[
                    {
                      value: "top_5",
                      label: "Top 5",
                    },
                    {
                      value: "top_10",
                      label: "Top 10",
                    },
                    {
                      value: "top_15",
                      label: "Top 15",
                    },
                    {
                      value: "top_20",
                      label: "Top 20",
                    },
                    {
                      value: "bottom_5",
                      label: "Bottom 5",
                    },
                    {
                      value: "bottom_10",
                      label: "Bottom 10",
                    },
                    {
                      value: "bottom_15",
                      label: "Bottom 15",
                    },
                    {
                      value: "bottom_20",
                      label: "Bottom 20",
                    },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      rankConfig: {
                        ...componentCreateData?.rankConfig,
                        limit: e.target.value,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
            </Box>
          )}
        </>
      )}
    </>
  );
}
