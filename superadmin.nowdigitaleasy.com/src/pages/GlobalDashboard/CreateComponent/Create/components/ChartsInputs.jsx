import { useTheme } from "@mui/material";
import { useMemo } from "react";
import {
  CommonSelect,
  CommonTextField,
} from "../../../../../components/common/fields";
import {
  useFields,
  useModules,
} from "../../../../../hooks/global-dashboard/global-dashboard";
import CriteriaFilter from "./CriteriaFilter/CriteriaFilter";

const sortOptions = [
  {
    label: "Value Descending",
    value: "desc-value",

    sort: { order: "desc", by: "value" },
  },
  {
    label: "Value Ascending",
    value: "asc-value",
    sort: { order: "asc", by: "value" },
  },
  {
    label: "Label Ascending",
    value: "asc-label",

    sort: { order: "asc", by: "label" },
  },
  {
    label: "Label Descending",
    value: "desc-label",

    sort: { order: "desc", by: "label" },
  },
];

export default function ChartsInputs({
  componentCreateData,
  setComponentCreateData,
  FieldRow,
}) {
  const theme = useTheme();
  // modules
  const { data: modules, isLoading: isFetchingModules } = useModules();

  // fields
  const { data: fields, isLoading: isFetchingFields } = useFields({
    module: componentCreateData?.module,
  });

  const criteriaFilters = useMemo(() => {
    const data = fields?.filters || [];

    return data?.map((item) => ({
      ...item,
      value: item?.field,
    }));
  }, [fields?.filters]);

  const metricList = useMemo(() => {
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

  const groupFields = useMemo(() => {
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
          loading={isFetchingModules}
          placeholder="Select"
          value={componentCreateData?.module}
          options={modules}
          disabled={isFetchingModules}
          clearable={false}
          onChange={(e) =>
            setComponentCreateData({
              name: componentCreateData?.name,
              ...(componentCreateData?.id
                ? { id: componentCreateData?.id }
                : {}),
              sort: sortOptions?.[0]?.sort,
              maxGrouping: 5,
              key: componentCreateData?.key,

              module: e.target.value,
            })
          }
          searchable
        />
      </FieldRow>
      {componentCreateData?.module && (
        <>
          {["bar", "column", "line"]?.includes(componentCreateData?.key) && (
            <>
              {" "}
              <FieldRow
                label={"Measure (y-axis)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.measure?.value}
                  options={metricList}
                  onChange={(e) => {
                    let selected = metricList?.find(
                      (i) => i?.value === e.target.value,
                    );
                    setComponentCreateData({
                      ...componentCreateData,
                      measure: {
                        module: componentCreateData?.module,
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
              <FieldRow
                label={"Grouping (x-axis)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping1?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping1: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow label={"Sort By"} required={true} maxWidth={"100%"}>
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={
                    componentCreateData?.sort?.order ||
                    componentCreateData?.sort?.by
                      ? `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}`
                      : null
                  }
                  options={sortOptions}
                  onChange={(e) => {
                    let selected = sortOptions?.find(
                      (i) => i?.value === e.target.value,
                    );
                    if (
                      `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}` ===
                      e.target.value
                    ) {
                      return;
                    }
                    setComponentCreateData({
                      ...componentCreateData,
                      sort: selected?.sort,
                    });
                  }}
                />
              </FieldRow>
              <FieldRow
                label={"Maximum grouping"}
                required={true}
                maxWidth={"100%"}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  clearable={false}
                  value={componentCreateData?.maxGrouping}
                  options={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    // { label: "15", value: "15" },
                    // { label: "20", value: "20" },
                    // { label: "30", value: "30" },
                    // { label: "40", value: "40" },
                    // { label: "50", value: "50" },
                    // { label: "75", value: "75" },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      maxGrouping: e.target.value,
                    });
                    if (componentCreateData?.maxGrouping)
                      setComponentCreateData({
                        ...componentCreateData,
                        maxGrouping: e.target.value,
                      });
                  }}
                />
              </FieldRow>
              <FieldRow label={"Benchmark for y-axis"} maxWidth={"100%"}>
                <CommonTextField
                  value={componentCreateData?.benchMark}
                  onChange={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      benchMark: e.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  onBlur={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      benchMark: 0 < e.target.value ? e.target.value : 0,
                    })
                  }
                  type="number"
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  placeholder={"Enter value (number)"}
                  inputProps={{ min: 0 }}
                />
              </FieldRow>
            </>
          )}
          {["heatmap"]?.includes(componentCreateData?.key) && (
            <>
              {" "}
              <FieldRow
                label={"Measure (Gradient)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.measure?.value}
                  options={metricList}
                  onChange={(e) => {
                    let selected = metricList?.find(
                      (i) => i?.value === e.target.value,
                    );
                    setComponentCreateData({
                      ...componentCreateData,
                      measure: {
                        module: componentCreateData?.module,
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
              <FieldRow
                label={"Grouping 1 (y-axis)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping1?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping1: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow
                label={"Grouping 2 (x-axis)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping2?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping2: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow label={"Sort By"} required={true} maxWidth={"100%"}>
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={
                    componentCreateData?.sort?.order ||
                    componentCreateData?.sort?.by
                      ? `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}`
                      : null
                  }
                  options={sortOptions}
                  onChange={(e) => {
                    let selected = sortOptions?.find(
                      (i) => i?.value === e.target.value,
                    );
                    if (
                      `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}` ===
                      e.target.value
                    ) {
                      return;
                    }
                    setComponentCreateData({
                      ...componentCreateData,
                      sort: selected?.sort,
                    });
                  }}
                />
              </FieldRow>
              <FieldRow
                label={"Maximum grouping"}
                required={true}
                maxWidth={"100%"}
              >
                <CommonSelect
                  required={true}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.maxGrouping}
                  clearable={false}
                  options={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    // { label: "15", value: "15" },
                    // { label: "20", value: "20" },
                    // { label: "30", value: "30" },
                    // { label: "40", value: "40" },
                    // { label: "50", value: "50" },
                    // { label: "75", value: "75" },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      maxGrouping: e.target.value,
                    });
                    if (componentCreateData?.maxGrouping)
                      setComponentCreateData({
                        ...componentCreateData,
                        maxGrouping: e.target.value,
                      });
                  }}
                />
              </FieldRow>
            </>
          )}
          {["donut", "pie"]?.includes(componentCreateData?.key) && (
            <>
              {" "}
              <FieldRow label={"Measure"} maxWidth={"100%"} required={true}>
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.measure?.value}
                  options={metricList}
                  onChange={(e) => {
                    let selected = metricList?.find(
                      (i) => i?.value === e.target.value,
                    );
                    setComponentCreateData({
                      ...componentCreateData,
                      measure: {
                        module: componentCreateData?.module,
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
              <FieldRow
                label={"Grouping (slices)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping1?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping1: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow label={"Sort By"} required={true} maxWidth={"100%"}>
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={
                    componentCreateData?.sort?.order ||
                    componentCreateData?.sort?.by
                      ? `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}`
                      : null
                  }
                  options={sortOptions}
                  onChange={(e) => {
                    let selected = sortOptions?.find(
                      (i) => i?.value === e.target.value,
                    );
                    if (
                      `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}` ===
                      e.target.value
                    ) {
                      return;
                    }
                    setComponentCreateData({
                      ...componentCreateData,
                      sort: selected?.sort,
                    });
                  }}
                />
              </FieldRow>
              <FieldRow
                label={"Maximum grouping"}
                required={true}
                maxWidth={"100%"}
              >
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.maxGrouping}
                  options={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    // { label: "15", value: "15" },
                    // { label: "20", value: "20" },
                    // { label: "30", value: "30" },
                    // { label: "40", value: "40" },
                    // { label: "50", value: "50" },
                    // { label: "75", value: "75" },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      maxGrouping: e.target.value,
                    });
                    if (componentCreateData?.maxGrouping)
                      setComponentCreateData({
                        ...componentCreateData,
                        maxGrouping: e.target.value,
                      });
                  }}
                />
              </FieldRow>
            </>
          )}
          {["table"]?.includes(componentCreateData?.key) && (
            <>
              {" "}
              <FieldRow
                label={"Measure (2nd column)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.measure?.value}
                  options={metricList}
                  onChange={(e) => {
                    let selected = metricList?.find(
                      (i) => i?.value === e.target.value,
                    );
                    setComponentCreateData({
                      ...componentCreateData,
                      measure: {
                        module: componentCreateData?.module,
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
              <FieldRow
                label={"Grouping (1st column)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping1?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping1: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow label={"Sort By"} required={true} maxWidth={"100%"}>
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={
                    componentCreateData?.sort?.order ||
                    componentCreateData?.sort?.by
                      ? `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}`
                      : null
                  }
                  options={sortOptions}
                  onChange={(e) => {
                    let selected = sortOptions?.find(
                      (i) => i?.value === e.target.value,
                    );
                    if (
                      `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}` ===
                      e.target.value
                    ) {
                      return;
                    }
                    setComponentCreateData({
                      ...componentCreateData,
                      sort: selected?.sort,
                    });
                  }}
                />
              </FieldRow>
              <FieldRow
                label={"Maximum grouping"}
                required={true}
                maxWidth={"100%"}
              >
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.maxGrouping}
                  options={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    // { label: "15", value: "15" },
                    // { label: "20", value: "20" },
                    // { label: "30", value: "30" },
                    // { label: "40", value: "40" },
                    // { label: "50", value: "50" },
                    // { label: "75", value: "75" },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      maxGrouping: e.target.value,
                    });
                    if (componentCreateData?.maxGrouping)
                      setComponentCreateData({
                        ...componentCreateData,
                        maxGrouping: e.target.value,
                      });
                  }}
                />
              </FieldRow>
            </>
          )}
          {["area"]?.includes(componentCreateData?.key) && (
            <>
              {" "}
              <FieldRow
                label={"Measure (y-axis)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.measure?.value}
                  options={metricList}
                  onChange={(e) => {
                    let selected = metricList?.find(
                      (i) => i?.value === e.target.value,
                    );
                    setComponentCreateData({
                      ...componentCreateData,
                      measure: {
                        module: componentCreateData?.module,
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
              <FieldRow
                label={"Grouping 1 (y-axis)"}
                maxWidth={"100%"}
                required={true}
              >
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping1?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping1: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow label={"Grouping 2 "} maxWidth={"100%"} required={true}>
                <CommonSelect
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  disabled={isFetchingFields}
                  loading={isFetchingFields}
                  value={componentCreateData?.grouping2?.value}
                  options={groupFields}
                  onChange={(e) => {
                    let selected = groupFields?.find(
                      (i) => i?.value === e.target.value,
                    );

                    setComponentCreateData({
                      ...componentCreateData,
                      grouping2: {
                        value: e.target.value,
                        field: selected?.field,
                        dataType: selected?.dataType,
                        ref: selected?.ref,
                        label: selected?.label,
                        labelField: selected?.labelField,
                        dateInterval: selected?.aggregation,
                      },
                    });
                  }}
                  searchable
                />
              </FieldRow>
              <FieldRow label={"Sort By"} required={true} maxWidth={"100%"}>
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={
                    componentCreateData?.sort?.order ||
                    componentCreateData?.sort?.by
                      ? `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}`
                      : null
                  }
                  options={sortOptions}
                  onChange={(e) => {
                    let selected = sortOptions?.find(
                      (i) => i?.value === e.target.value,
                    );
                    if (
                      `${componentCreateData?.sort?.order}-${componentCreateData?.sort?.by}` ===
                      e.target.value
                    ) {
                      return;
                    }
                    setComponentCreateData({
                      ...componentCreateData,
                      sort: selected?.sort,
                    });
                  }}
                />
              </FieldRow>
              <FieldRow
                label={"Maximum grouping"}
                required={true}
                maxWidth={"100%"}
              >
                <CommonSelect
                  clearable={false}
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,

                    height: "40px",
                  }}
                  value={componentCreateData?.maxGrouping}
                  options={[
                    { label: "5", value: "5" },
                    { label: "10", value: "10" },
                    // { label: "15", value: "15" },
                    // { label: "20", value: "20" },
                    // { label: "30", value: "30" },
                    // { label: "40", value: "40" },
                    // { label: "50", value: "50" },
                    // { label: "75", value: "75" },
                  ]}
                  onChange={(e) => {
                    setComponentCreateData({
                      ...componentCreateData,
                      maxGrouping: e.target.value,
                    });
                    if (componentCreateData?.maxGrouping)
                      setComponentCreateData({
                        ...componentCreateData,
                        maxGrouping: e.target.value,
                      });
                  }}
                />
              </FieldRow>
              <FieldRow label={"Benchmark for y-axis"} maxWidth={"100%"}>
                <CommonTextField
                  value={componentCreateData?.benchMark}
                  onChange={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      benchMark: e.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  onBlur={(e) =>
                    setComponentCreateData({
                      ...componentCreateData,
                      benchMark: 0 < e.target.value ? e.target.value : 0,
                    })
                  }
                  type="number"
                  sx={{
                    bgcolor: theme.palette.background.default,
                    borderRadius: 2,
                    height: "40px",
                  }}
                  placeholder={"Enter value (number)"}
                  inputProps={{ min: 0 }}
                />
              </FieldRow>
            </>
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
        </>
      )}
    </>
  );
}
