import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo, useState } from "react";
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

const chartWrapperSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
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

const ChartBody = ({ items, colorMap }) => (
  <Box
    sx={{
      width: "100%",
      maxWidth: 260,
      mx: "auto",
    }}
  >
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={items}
          dataKey="value"
          nameKey="label"
          outerRadius="80%"
          minAngle={10}
        >
          {items.map((item) => (
            <Cell key={item.label} fill={colorMap[item.label]} />
          ))}
        </Pie>

        <RechartsTooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  </Box>
);

// ─── Main Component ───────────────────────────────────────────────────────

function PieChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: content, isFetching } = useDashboardChartCard({ id });

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const rawItems = useMemo(() => source?.items || [], [source]);

  const [hiddenMap, setHiddenMap] = useState({});

  const toggleItem = (label) => {
    setHiddenMap((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // 1. Generate stable colors based on ALL items
  const colors = useChartPalette(rawItems?.length || 10);

  // 2. Map colors tightly to specific item labels so they don't change
  const colorMap = useMemo(() => {
    const map = {};
    rawItems.forEach((item, i) => {
      map[item.label] = colors[i % colors.length];
    });
    return map;
  }, [rawItems, colors]);

  // 3. Prevent chart tracking issues by keeping hidden items with value: 0
  const items = useMemo(
    () =>
      rawItems.map((item) =>
        hiddenMap[item.label] ? { ...item, value: 0 } : item,
      ),
    [rawItems, hiddenMap],
  );

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
          seriesKeys={rawItems?.map((i) => i?.label)}
          colors={colors}
          hiddenMap={hiddenMap}
          toggleItem={toggleItem}
        />
      )}

      <CardContent
        sx={{
          p: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
        }}
      >
        {id && isFetching ? (
          <AnalyticsLoader size={3} />
        ) : rawItems.length ? (
          <Box sx={{ ...chartWrapperSx }}>
            <ChartBody items={items} colorMap={colorMap} />
          </Box>
        ) : (
          <NoDataDashboard />
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(PieChartComp);
