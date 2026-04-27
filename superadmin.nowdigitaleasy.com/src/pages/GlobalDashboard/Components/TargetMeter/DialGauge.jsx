import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { useDashboardTargetCard } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";
import NoDataDashboard from "../DashboardNoData";
import OpenDetailView from "../DetailView/OpenDetailView";

// ─── Constants ─────────────────────────────────────────────

const RADIAN = Math.PI / 180;

// Chart must be wide enough for the arc + labels on both sides
// Height = roughly half of width so the semicircle fills it tightly
const CHART_W = 280;
const CHART_H = 130;

// cx centered, cy at the very bottom of the chart area so arc sits flush
const CX = CHART_W / 2.1; // 140
const CY = CHART_H - 30; // 155 — pivot at the bottom edge, arc shows above

const INNER_R = 55;
const OUTER_R = 88;

// ─── Styles ───────────────────────────────────────────────

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

// ─── Needle ───────────────────────────────────────────────
// Maps value 0→total to angle 180°→0° (left to right across the semicircle)

function renderNeedle(value, total, cx, cy, iR, needleColor, bgColor) {
  const ratio = Math.min(Math.max(value / total, 0), 1);
  const angleDeg = 180 - ratio * 180;
  const rad = angleDeg * RADIAN;

  const length = iR - 6;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  // Tip — SVG y is flipped so subtract the sin component
  const xp = cx + length * cos;
  const yp = cy - length * sin;

  // Base perpendicular to needle
  const base = 4;
  const xba = cx + base * sin;
  const yba = cy + base * cos;
  const xbb = cx - base * sin;
  const ybb = cy - base * cos;

  return (
    <>
      <path
        d={`M ${xba} ${yba} L ${xbb} ${ybb} L ${xp} ${yp} Z`}
        fill={needleColor}
      />
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={bgColor}
        stroke={needleColor}
        strokeWidth={2}
      />
    </>
  );
}

// ─── Gauge Body ───────────────────────────────────────────

const GaugeBody = React.memo(
  ({ currentValue, targetValue, primaryColor, bgColor, paperColor }) => {
    const theme = useTheme();

    const safeTarget = targetValue > 0 ? targetValue : 100;

    // CRITICAL: clamp so the filled arc never overshoots
    const safeCurrent = Math.min(Math.max(currentValue ?? 0, 0), safeTarget);

    // Needle angle (same formula as renderNeedle)
    const ratio = safeCurrent / safeTarget;
    const angleDeg = 180 - ratio * 180;
    const rad = angleDeg * RADIAN;

    // Value label: place it just outside the outer arc along the needle direction
    const labelRadius = OUTER_R + 16;
    const labelX = CX + labelRadius * Math.cos(rad);
    const labelY = CY - labelRadius * Math.sin(rad);

    // Arc data — two slices, filled then empty
    const data = useMemo(
      () => [{ value: safeCurrent }, { value: safeTarget - safeCurrent }],
      [safeCurrent, safeTarget],
    );

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flex: 1,
          flexDirection: "column",
        }}
      >
        <PieChart
          width={CHART_W}
          height={CHART_H}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          style={{ overflow: "visible" }}
        >
          <Pie
            data={data}
            dataKey="value"
            startAngle={180}
            endAngle={0}
            cx={CX}
            cy={CY}
            innerRadius={INNER_R}
            outerRadius={OUTER_R}
            stroke="none"
            isAnimationActive={false}
          >
            <Cell fill={primaryColor} />
            <Cell fill={bgColor} />
          </Pie>

          {renderNeedle(
            safeCurrent,
            safeTarget,
            CX,
            CY,
            INNER_R,
            "#475569",
            paperColor,
          )}

          {/* Current value — floats above the needle tip */}
          <text
            x={labelX}
            y={labelY}
            textAnchor="middle"
            dominantBaseline="auto"
            fill={theme.palette.text.primary}
            fontSize={13}
            fontWeight={600}
          >
            {safeCurrent}
          </text>

          {/* 0 at left end of arc */}
          <text
            x={CX - OUTER_R}
            y={CY + 10}
            textAnchor="end"
            dominantBaseline="middle"
            fill={theme.palette.text.secondary}
            fontSize={11}
            fontWeight={500}
          >
            0
          </text>

          {/* Target at right end of arc */}
          <text
            x={CX + OUTER_R}
            y={CY + 10}
            textAnchor="start"
            dominantBaseline="middle"
            fill={theme.palette.text.secondary}
            fontSize={11}
            fontWeight={500}
          >
            {safeTarget}
          </text>
        </PieChart>
        <Typography sx={{ fontSize: "12px", color: "text.secondary" }}>
          {currentValue <= targetValue
            ? `Remaining : ${targetValue - currentValue}`
            : `target ${targetValue} completed!`}
        </Typography>
      </Box>
    );
  },
);

// ─── Main Component ───────────────────────────────────────

function DialGaugeComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const { data: content, isFetching } = useDashboardTargetCard({ id });

  const source = useMemo(
    () => (id ? content?.data : data),
    [id, content?.data, data],
  );

  const currentValue = source?.currentValue;
  const targetValue = source?.targetValue;

  const hasData = currentValue != null && targetValue != null;

  const isDark = theme.palette.mode === "dark";
  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        minWidth: 330,
        height: 200,
        ...(!id
          ? {}
          : {
              backgroundColor: isDark
                ? "background.default"
                : "background.paper",
            }),
      }}
    >
      <CardContent sx={cardContentSx}>
        <OpenDetailView disableDetails={disableDetails} data={source} />

        {id && isFetching ? (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnalyticsLoader size={3} />
          </Box>
        ) : hasData ? (
          <GaugeBody
            currentValue={currentValue}
            targetValue={targetValue}
            primaryColor={theme.palette.primary.main}
            bgColor={
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette.grey[200]
            }
            paperColor={theme.palette.background.paper}
          />
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <NoDataDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(DialGaugeComp);
