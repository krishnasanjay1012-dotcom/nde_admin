import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
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

// ─── Styles ───────────────────────────────────────────────────────────────

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
      <Typography variant="caption" fontWeight={600} mb={0.5} noWrap>
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
          <Typography variant="caption" color="text.secondary">
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

// ─── Chart Body ───────────────────────────────────────────────────────────

const ChartBody = React.memo(
  ({ BenchMarkLine, items, primaryColor, textColor }) => (
    <Box sx={chartBoxSx}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={items}
          margin={{ top: 20, right: 16, bottom: 0, left: -20 }}
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

          <RechartsTooltip content={<CustomTooltip />} />

          <Line
            type="monotone"
            dataKey="value"
            stroke={primaryColor}
            strokeWidth={2}
            activeDot={{ r: 8 }}
            dot={{ r: 4, fill: primaryColor }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  ),
);

// ─── Main Component ───────────────────────────────────────────────────────

function LineChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data: content, isFetching } = useDashboardChartCard({ id });

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const rawItems = useMemo(
    () => (source?.items?.length ? source.items : data?.items),
    [source?.items, data?.items],
  );

  // ─── Legend State ───────────────────────────────────────────────────────

  const [hiddenMap, setHiddenMap] = useState({});

  const toggleItem = (label) => {
    setHiddenMap((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // ─── Apply Visibility (same as pie) ─────────────────────────────────────

  const items = useMemo(() => {
    if (!rawItems?.length) return [];
    return rawItems.filter((item) => !hiddenMap[item.label]);
  }, [rawItems, hiddenMap]);

  // ─── Legend Sorting (LOW → HIGH) ────────────────────────────────────────

  const legendItems = useMemo(() => {
    if (!rawItems?.length) return [];
    return [...rawItems].sort((a, b) => a.value - b.value);
  }, [rawItems]);

  const primaryColor = theme.palette.primary.main;
  const textColor = theme.palette.text.secondary;

  const BenchMarkLine = () => (
    <ReferenceLine
      y={source?.benchMark}
      stroke={primaryColor}
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
        ...(id && {
          backgroundColor: isDark ? "background.default" : "background.paper",
        }),
      }}
    >
      <CardContent sx={cardContentSx}>
        <OpenDetailView disableDetails={disableDetails} data={source} />

        {/* ✅ Legend (sorted low → high) */}
        {legendItems.length > 0 && (
          <ChartLegend
            seriesKeys={legendItems.map((i) => i.label)}
            colors={legendItems.map(() => primaryColor)}
            hiddenMap={hiddenMap}
            toggleItem={toggleItem}
          />
        )}

        {id && isFetching ? (
          <Box sx={centeredBoxSx}>
            <AnalyticsLoader size={3} />
          </Box>
        ) : items?.length ? (
          <ChartBody
            BenchMarkLine={<BenchMarkLine />}
            items={items}
            primaryColor={primaryColor}
            textColor={textColor}
          />
        ) : (
          <Box sx={centeredBoxSx}>
            <NoDataDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(LineChartComp);
