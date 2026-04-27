import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

import { useDashboardChartCard } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";
import NoDataDashboard from "../DashboardNoData";

import OpenDetailView from "../DetailView/OpenDetailView";
import ChartLegend from "./ChartLegend";
import { useChartSeries } from "./useChartSeries";

// ─── KEEP YOUR ORIGINAL STYLES ────────────────────────────────────────────────

const cardSx = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 2,
  border: "1px solid",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  borderColor: "divider",
  "&:hover": { borderColor: "primary.main" },
};

const cardContentSx = {
  display: "flex",
  flexDirection: "column",
  flex: 1,
  minHeight: 0,
  p: "16px !important",
};

const centeredBoxSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%",
};

const chartBoxSx = { flex: 1, minHeight: 180 };
// ─── Tooltip ──────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label, colorMap }) => {
  if (!active || !payload?.length) return null;
  const visible = payload.filter((p) => p.value > 0);

  const resolvedColor = (i) => colorMap?.[label] || i.color;
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        p: 1,
        maxWidth: 240,
      }}
    >
      <Typography
        variant="caption"
        display="block"
        fontWeight={600}
        mb={0.5}
        noWrap
        sx={{
          maxWidth: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </Typography>
      {visible.map((p) => (
        <Box key={p.dataKey} display="flex" alignItems="center" gap={0.75}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: resolvedColor(p),
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" color="text.secondary" noWrap>
            {p.dataKey}:
          </Typography>
          <Typography variant="caption" fontWeight={600}>
            {p.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

// ─── FIXED CHART BODY ─────────────────────────────────────────────────────────

const ChartBody = React.memo(
  ({
    BenchMarkLine,
    chartData,
    seriesKeys,
    colors,
    hiddenMap,
    textColor,
    isSingleSeries,
    colorMap,
  }) => {
    const visibleData = isSingleSeries
      ? chartData.filter((d) => !hiddenMap[d.label])
      : chartData;

    return (
      <Box sx={chartBoxSx}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={visibleData}
            margin={{ top: 20, right: 16, bottom: 0, left: -20 }} // KEEP
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
            />

            {BenchMarkLine}

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: textColor }}
            />

            <RechartsTooltip content={<CustomTooltip colorMap={colorMap} />} />

            {/* ✅ SINGLE SERIES (your case) */}
            {isSingleSeries ? (
              <Bar
                dataKey="value"
                barSize={25} // KEEP your design
                radius={[3, 3, 0, 0]}
              >
                {visibleData.map((entry) => (
                  <Cell key={entry.label} fill={colorMap[entry.label]} />
                ))}

                <LabelList
                  dataKey="value"
                  position="top" // KEEP your design
                  fontSize={12}
                />
              </Bar>
            ) : (
              // multi-series fallback
              seriesKeys.map((key, i) =>
                hiddenMap[key] ? null : (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[i % colors.length]}
                    barSize={40}
                    radius={[3, 3, 0, 0]}
                  />
                ),
              )
            )}
          </BarChart>
        </ResponsiveContainer>
      </Box>
    );
  },
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

function ColumnChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data: content, isFetching } = useDashboardChartCard({ id });

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const rawItems = useMemo(
    () => source?.items ?? data?.items ?? [],
    [source?.items, data?.items],
  );

  const {
    chartData,
    seriesKeys,
    colors,
    hiddenMap,
    toggleItem,
    isSingleSeries,
    colorMap,
    legendKeys,
  } = useChartSeries(rawItems);

  const textColor = theme.palette.text.secondary;

  const BenchMarkLine = () => (
    <ReferenceLine
      y={source?.benchMark}
      stroke={colors[0]}
      strokeDasharray="3 3"
      label="Target"
    />
  );

  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        minWidth: 330,
        height: 300,
        ...(id
          ? {
              backgroundColor: isDark
                ? "background.default"
                : "background.paper",
            }
          : {}),
      }}
    >
      <CardContent sx={cardContentSx}>
        <OpenDetailView disableDetails={disableDetails} data={source} />

        {id && isFetching ? (
          <Box sx={centeredBoxSx}>
            <AnalyticsLoader size={3} />
          </Box>
        ) : chartData.length ? (
          <>
            {/* ✅ FIXED LEGEND */}
            <ChartLegend
              seriesKeys={legendKeys}
              colors={legendKeys.map((k, i) =>
                isSingleSeries ? colorMap[k] : colors[i],
              )}
              hiddenMap={hiddenMap}
              toggleItem={toggleItem}
            />

            <ChartBody
              BenchMarkLine={<BenchMarkLine />}
              chartData={chartData}
              seriesKeys={seriesKeys}
              colors={colors}
              hiddenMap={hiddenMap}
              textColor={textColor}
              isSingleSeries={isSingleSeries}
              colorMap={colorMap}
            />
          </>
        ) : (
          <Box sx={centeredBoxSx}>
            <NoDataDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(ColumnChartComp);
