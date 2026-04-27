import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { useDashboardTargetCard } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";
import NoDataDashboard from "../DashboardNoData";
import OpenDetailView from "../DetailView/OpenDetailView";

// ─── Constants ─────────────────────────────────────────────

const RADIAN = Math.PI / 180;

const CHART_W = 280;
const CHART_H = 130;

const CX = CHART_W / 2;
const CY = CHART_H - 20;

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

function renderNeedle(
  value,
  total,
  cx,
  cy,
  iR,
  oR,
  paperColor,
  labelColor,
  prefix,
  suffix,
) {
  const ratio = Math.min(Math.max(value / total, 0), 1);
  const angleDeg = 180 - ratio * 180;
  const rad = angleDeg * RADIAN;

  const length = iR - 6;
  const sin = Math.sin(rad);
  const cos = Math.cos(rad);

  const xp = cx + length * cos;
  const yp = cy - length * sin;

  const base = 4;
  const xba = cx + base * sin;
  const yba = cy + base * cos;
  const xbb = cx - base * sin;
  const ybb = cy - base * cos;

  const labelRadius = oR + 16;
  const labelX = cx + labelRadius * cos;
  const labelY = cy - labelRadius * sin;

  return (
    <g>
      <path
        d={`M ${xba} ${yba} L ${xbb} ${ybb} L ${xp} ${yp} Z`}
        fill="#475569"
        stroke="none"
      />
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={paperColor}
        stroke="#475569"
        strokeWidth={2}
      />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="auto"
        fill={labelColor}
        fontSize={13}
        fontWeight={700}
      >
        {prefix}
        {value}
        {suffix}
      </text>
    </g>
  );
}

// ─── Traffic Light Body ────────────────────────────────────

const TrafficLightBody = React.memo(
  ({
    currentValue,
    targetValue,
    firstPercent,
    secondPercent,
    prefix,
    suffix,
    paperColor,
  }) => {
    const theme = useTheme();

    const safeTarget = targetValue > 0 ? targetValue : 100;
    const safeCurrent = Math.min(Math.max(currentValue ?? 0, 0), safeTarget);

    // ── Zone boundaries ──────────────────────────────────────
    // first_percent  = % of targetValue where Low  → Medium boundary falls
    // second_percent = % of targetValue where Medium → High  boundary falls
    // e.g. targetValue=80, first_percent=10, second_percent=20
    //   Low    = 0  → 8   (10% of 80)
    //   Medium = 8  → 16  (20% of 80)
    //   High   = 16 → 80  (remainder)

    const lowEnd = (firstPercent / 100) * safeTarget; //  8
    const mediumEnd = (secondPercent / 100) * safeTarget; // 16
    const highEnd = safeTarget; // 80

    const data = useMemo(
      () => [
        { name: "Low", value: lowEnd },
        { name: "Medium", value: mediumEnd - lowEnd },
        { name: "High", value: highEnd - mediumEnd },
      ],
      [lowEnd, mediumEnd, highEnd],
    );

    const colors = [
      theme.palette.error.main,
      theme.palette.warning.main,
      theme.palette.success.main,
    ];

    const textSecondary = theme.palette.text.secondary;

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
            paddingAngle={1}
            isAnimationActive={false}
          >
            {data.map((_, i) => (
              <Cell key={`cell-${i}`} fill={colors[i]} />
            ))}
          </Pie>

          {renderNeedle(
            safeCurrent,
            safeTarget,
            CX,
            CY,
            INNER_R,
            OUTER_R,
            paperColor,
            theme.palette.text.primary,
            prefix,
            suffix,
          )}

          {/* Min label */}
          <text
            x={CX - OUTER_R}
            y={CY + 8}
            textAnchor="end"
            dominantBaseline="middle"
            fill={textSecondary}
            fontSize={11}
            fontWeight={500}
          >
            {prefix}0{suffix}
          </text>

          {/* Max / target label */}
          <text
            x={CX + OUTER_R}
            y={CY + 8}
            textAnchor="start"
            dominantBaseline="middle"
            fill={textSecondary}
            fontSize={11}
            fontWeight={500}
          >
            {prefix}
            {safeTarget}
            {suffix}
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

function TrafficLightsComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const { data: content, isFetching } = useDashboardTargetCard({ id });

  const source = useMemo(
    () => (id ? content?.data : data),
    [id, content?.data, data],
  );

  const currentValue = source?.currentValue;
  const targetValue = source?.targetValue;
  const firstPercent = source?.thresholds?.firstPercent ?? 33; // fallback to equal thirds
  const secondPercent = source?.thresholds?.secondPercent ?? 66;

  const prefix = source?.prefix ?? "";
  const suffix = source?.suffix ?? "";

  const hasData = currentValue != null && targetValue != null;
  const isDark = theme.palette.mode === "dark";
  console.log(data, source);

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
          <TrafficLightBody
            currentValue={currentValue}
            targetValue={targetValue}
            firstPercent={firstPercent}
            secondPercent={secondPercent}
            prefix={prefix}
            suffix={suffix}
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

export default React.memo(TrafficLightsComp);
