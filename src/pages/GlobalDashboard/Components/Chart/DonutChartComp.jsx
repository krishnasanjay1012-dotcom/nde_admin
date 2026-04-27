import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  Cell,
  Pie,
  PieChart,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import { useDashboardChartCard } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";
import NoDataDashboard from "../DashboardNoData";
import OpenDetailView from "../DetailView/OpenDetailView";
import { useChartPalette } from "../utils/ColorGenerator";
import ChartLegend from "./ChartLegend";

// ─── Styles ───────────────────────────────────────────────────────────────

const cardSx = {
  display: "flex",
  flexDirection: "column",
  borderRadius: 2,
  border: "1px solid",
  borderColor: "divider",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  overflow: "hidden",
  "&:hover": { borderColor: "primary.main" },
};

// ─── Tooltip ──────────────────────────────────────────────────────────────

const CustomTooltip = ({ active, payload }) => {
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
        {visible?.[0]?.payload?.label}
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

// ─── Chart ────────────────────────────────────────────────────────────────

const ChartBody = ({ items, colorMap, total, theme }) => (
  <Box sx={{ width: "100%", maxWidth: 260, mx: "auto" }}>
    <ResponsiveContainer width="100%" height={200}>
      <PieChart tabIndex={-1}>
        <Pie
          data={items}
          dataKey="value"
          nameKey="label"
          minAngle={10}
          outerRadius={75}
          innerRadius={50}
          // paddingAngle={2}
        >
          {items.map((item) => (
            <Cell key={item.label} fill={colorMap[item.label]} />
          ))}
        </Pie>

        {/* Center Total */}
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
          <tspan
            fontSize="16"
            fontWeight="600"
            fill={theme.palette.text.primary}
          >
            {total}
          </tspan>
          <tspan
            x="50%"
            dy="1.4em"
            fontSize="10"
            fill={theme.palette.text.secondary}
          >
            Total
          </tspan>
        </text>

        <RechartsTooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────

function DonutChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: content, isFetching } = useDashboardChartCard({ id });

  const source = id ? content : data;
  const rawItems = source?.items || [];

  const [hiddenMap, setHiddenMap] = useState({});

  const toggleItem = (label) => {
    setHiddenMap((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Stable color mapping
  const colors = useChartPalette(rawItems?.length || 10);

  const colorMap = {};
  rawItems.forEach((item, i) => {
    colorMap[item.label] = colors[i % colors.length];
  });

  // Prevent chart reset (value = 0 instead of filter)
  const items = rawItems.map((item) =>
    hiddenMap[item.label] ? { ...item, value: 0 } : item,
  );

  const total = rawItems.reduce((acc, curr) => acc + (curr.value || 0), 0);

  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        minWidth: 330,
        height: 300,
        ...(!id
          ? {}
          : {
              backgroundColor: isDark
                ? "background.default"
                : "background.paper",
            }),
      }}
    >
      <Box px={2} pt={2}>
        <OpenDetailView disableDetails={disableDetails} data={source} />
      </Box>

      {rawItems.length > 0 && (
        <ChartLegend
          seriesKeys={[...rawItems].reverse().map((i) => i?.label)}
          colors={[...rawItems].reverse().map((i) => colorMap[i?.label])}
          hiddenMap={hiddenMap}
          toggleItem={toggleItem}
        />
      )}

      <CardContent
        sx={{
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        {id && isFetching ? (
          <AnalyticsLoader size={3} />
        ) : rawItems.length ? (
          <ChartBody
            items={items}
            colorMap={colorMap}
            total={total}
            theme={theme}
          />
        ) : (
          <NoDataDashboard />
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(DonutChartComp);
