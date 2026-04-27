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

/* -------------------------- STYLES -------------------------- */

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

const chartBoxSx = { flex: 1, minHeight: 180, p: 0.3 };

/* -------------------------- UTIL -------------------------- */

const truncate = (str, max = 14) => {
  if (!str) return "";
  return str.length > max ? `${str.slice(0, max)}…` : str;
};

/* -------------------- CUSTOM Y-AXIS TICK -------------------- */

const CustomYAxisTick = React.memo(function CustomYAxisTick(props) {
  const { x, y, payload, theme } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={4}
        textAnchor="end"
        fill={theme.palette.text.secondary}
        fontSize={12}
      >
        <title>{payload.value}</title>
        {truncate(payload.value, 6)}
      </text>
    </g>
  );
});
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

/* -------------------------- COMPONENT -------------------------- */

function BarChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data: content, isFetching } = useDashboardChartCard({ id });

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const rawItems = source?.items ?? [];

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

  const visibleData = useMemo(
    () =>
      isSingleSeries ? chartData.filter((d) => !hiddenMap[d.label]) : chartData,
    [chartData, hiddenMap, isSingleSeries],
  );

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
        ) : visibleData.length ? (
          <>
            <ChartLegend
              seriesKeys={[...legendKeys].reverse()}
              colors={legendKeys
                .map((k, i) => (isSingleSeries ? colorMap[k] : colors[i]))
                .reverse()}
              hiddenMap={hiddenMap}
              toggleItem={toggleItem}
            />

            <Box sx={chartBoxSx}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={visibleData}
                  layout="vertical"
                  margin={{ top: 10, right: 40, bottom: 0, left: 15 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tickCount={visibleData?.length}
                    tick={{ fontSize: 12, fill: textColor }}
                  />

                  <YAxis
                    dataKey="label"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={50} // slightly increased for better fit
                    tick={<CustomYAxisTick theme={theme} />}
                  />

                  {BenchMarkLine()}

                  <RechartsTooltip
                    content={<CustomTooltip colorMap={colorMap} />}
                  />

                  {isSingleSeries ? (
                    <Bar dataKey="value" barSize={20} radius={[0, 3, 3, 0]}>
                      {visibleData.map((entry) => (
                        <Cell key={entry.label} fill={colorMap[entry.label]} />
                      ))}

                      <LabelList
                        dataKey="value"
                        position="right"
                        fontSize={12}
                      />
                    </Bar>
                  ) : (
                    seriesKeys.map((key, i) =>
                      hiddenMap[key] ? null : (
                        <Bar
                          key={key}
                          dataKey={key}
                          fill={colors[i]}
                          barSize={20}
                        />
                      ),
                    )
                  )}
                </BarChart>
              </ResponsiveContainer>
            </Box>
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

export default React.memo(BarChartComp);
