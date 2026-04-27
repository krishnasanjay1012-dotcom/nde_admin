import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { useChartPalette } from "../utils/ColorGenerator";
import ChartLegend from "./ChartLegend";

// ─── Static sx ────────────────────────────────────────────────────────────────

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

const chartBoxSx = { flex: 1, minHeight: 150 };

// ─── Data Transform ───────────────────────────────────────────────────────────
// Input:  [{ x1, x2, value }]
// x1 → X-axis label, x2 → series/group key, value → Y value
// Output: { chartData: [{ label, [seriesKey]: value, ... }], seriesKeys: string[] }

function transformToMultiSeries(raw = []) {
  if (!raw.length) return { chartData: [], seriesKeys: [] };

  const x1Set = [...new Set(raw.map((d) => d.x1))];
  const x2Set = [...new Set(raw.map((d) => d.x2))];

  // Build lookup: x1 → x2 → aggregated value
  const lookup = {};
  for (const row of raw) {
    if (!lookup[row.x1]) lookup[row.x1] = {};
    lookup[row.x1][row.x2] = (lookup[row.x1][row.x2] || 0) + row.value;
  }

  const chartData = x1Set.map((x1) => {
    const point = { label: x1 };
    for (const x2 of x2Set) {
      point[x2] = lookup[x1]?.[x2] ?? 0;
    }
    return point;
  });

  return { chartData, seriesKeys: x2Set };
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const visible = payload.filter((p) => p.value > 0);
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
              bgcolor: p.color,
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

// ─── Chart Body ───────────────────────────────────────────────────────────────

const ChartBody = React.memo(
  ({ chartData, seriesKeys, benchMark, hiddenMap, textColor, colors }) => (
    <Box sx={chartBoxSx}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 16, bottom: 0, left: -20 }}
        >
          <defs>
            {seriesKeys.map((key, i) => {
              const color = colors[i % colors.length];
              return (
                <linearGradient
                  key={key}
                  id={`grad-${i}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              );
            })}
          </defs>

          <CartesianGrid strokeDasharray="3 3" vertical={false} />

          <XAxis
            dataKey="label"
            axisLine={false}
            tick={{ fontSize: 11, fill: textColor }}
            interval="preserveStartEnd"
            tickFormatter={(val) =>
              val?.length > 12 ? `${val.slice(0, 12)}…` : val
            }
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tickCount={chartData.length ? chartData.length + 2 : undefined}
            domain={[0, "auto"]}
            tick={{ fontSize: 12, fill: textColor }}
          />

          {benchMark && (
            <ReferenceLine
              y={benchMark}
              strokeDasharray="3 3"
              stroke={colors[0]}
              label={{
                value: "Target",
                fontSize: 11,
                fill: colors[0],
              }}
            />
          )}

          <RechartsTooltip content={<CustomTooltip />} />

          {seriesKeys.map((key, i) =>
            hiddenMap[key] ? null : (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[i % colors.length]}
                strokeWidth={1.5}
                fillOpacity={1}
                fill={`url(#grad-${i})`}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ),
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Box>
  ),
);

// ─── Main Component ───────────────────────────────────────────────────────────

function AreaChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: content, isFetching } = useDashboardChartCard({ id });
  const SERIES_COLORS = useChartPalette(15);

  const [hiddenMap, setHiddenMap] = useState({});
  const toggleItem = (key) =>
    setHiddenMap((prev) => ({ ...prev, [key]: !prev[key] }));

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const rawItems = useMemo(
    () => (source?.items?.length ? source.items : (data?.items ?? [])),
    [source?.items, data?.items],
  );

  const { chartData, seriesKeys } = useMemo(
    () => transformToMultiSeries(rawItems),
    [rawItems],
  );

  const textColor = theme.palette.text.secondary;

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
            <ChartLegend
              seriesKeys={[...seriesKeys].reverse()}
              colors={seriesKeys
                .map((_, i) => SERIES_COLORS[i % SERIES_COLORS.length])
                .reverse()}
              hiddenMap={hiddenMap}
              toggleItem={toggleItem}
            />
            <ChartBody
              chartData={chartData}
              seriesKeys={seriesKeys}
              benchMark={source?.benchMark}
              hiddenMap={hiddenMap}
              colors={SERIES_COLORS}
              textColor={textColor}
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

export default React.memo(AreaChartComp);
