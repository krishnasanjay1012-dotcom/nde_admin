import { Box, Card, CardContent, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import { useDashboardTargetCard } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";
import NoDataDashboard from "../DashboardNoData";
import OpenDetailView from "../DetailView/OpenDetailView";

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

const centeredBoxSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flex: 1,
  width: "100%",
};

// ─── Tick helpers ─────────────────────────────────────────

function generateTicks(max, count = 6) {
  const step = Math.ceil(max / count);
  const ticks = [];
  for (let i = 0; i <= count; i++) {
    const v = i * step;
    if (v <= max) ticks.push(v);
  }
  if (ticks[ticks.length - 1] !== max) ticks.push(max);
  return ticks;
}

// ─── Bar Body ─────────────────────────────────────────────

const BarBody = React.memo(
  ({ currentValue, targetValue, barColor, bgBarColor }) => {
    const max = targetValue * 1.5;

    const achievedPct = Math.min((currentValue / max) * 100, 100);
    const targetPct = Math.min((targetValue / max) * 100, 100);

    const ticks = useMemo(() => generateTicks(max), [max]);

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
          width: "100%",
          gap: 1,
          p: 1,
        }}
      >
        {/* ── Progress bar ── */}
        <Box sx={{ width: "100%", position: "relative", mt: 2.5 }}>
          {/* Background track */}
          <Box
            sx={{
              width: "100%",
              height: 28,
              bgcolor: bgBarColor,
              borderRadius: 0.5,
              position: "relative",
              overflow: "visible",
            }}
          >
            {/* Achieved fill */}
            <Box
              sx={{
                width: `${achievedPct}%`,
                height: "100%",
                bgcolor: barColor,
                borderRadius: "4px 0 0 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                pr: achievedPct > 8 ? 1 : 0,
                transition: "width 0.4s ease",
              }}
            >
              {achievedPct > 8 && (
                <Typography
                  variant="caption"
                  sx={{
                    color: "primary.contrastText",
                    fontWeight: 600,
                    fontSize: "0.72rem",
                  }}
                >
                  {currentValue}
                </Typography>
              )}
            </Box>

            {/* Target marker line */}
            <Box
              sx={{
                position: "absolute",
                left: `${targetPct}%`,
                top: -6,
                bottom: -6,
                width: 2,
                bgcolor: "text.primary",
                borderRadius: 1,
              }}
            />
          </Box>

          {/* Target label — above the marker line */}
          <Typography
            sx={{
              position: "absolute",
              left: `calc(${targetPct}% + 6px)`,
              top: -22,
              fontSize: "0.7rem",
              color: "text.primary",
              fontWeight: 600,
              whiteSpace: "nowrap",
            }}
          >
            Target: {targetValue}
          </Typography>
        </Box>

        {/* ── Tick labels ── */}
        <Box sx={{ width: "100%", position: "relative", height: 16 }}>
          {ticks.map((val) => {
            const pct = (val / max) * 100;
            return (
              <Typography
                key={val}
                sx={{
                  position: "absolute",
                  left: `${pct}%`,
                  transform: "translateX(-50%)",
                  fontSize: "0.68rem",
                  color: "text.secondary",
                  lineHeight: 1,
                }}
              >
                {val}
              </Typography>
            );
          })}
        </Box>

        {/* ── Legend ── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mt: 0.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              bgcolor: barColor,
              borderRadius: 0.5,
              flexShrink: 0,
            }}
          />
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            Achieved : {currentValue}
          </Typography>
        </Box>
      </Box>
    );
  },
);

// ─── Main Component ───────────────────────────────────────

function SingleBarComp({
  data = {},
  width = 330,
  height = 200,
  disableDetails,

  id,
}) {
  const theme = useTheme();
  const { data: content, isFetching } = useDashboardTargetCard({ id });

  const source = useMemo(
    () => (id ? content?.data : data),
    [id, content?.data, data],
  );

  const currentValue = source?.currentValue;
  const targetValue = source?.targetValue;

  const hasData = currentValue != null && targetValue != null;

  const barColor = theme.palette.primary.main;
  const bgBarColor =
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[200];

  // Sizing — same pattern as ColumnChartComp
  const sizeSx = useMemo(() => ({ minWidth: width, height }), [width, height]);

  const isDark = theme.palette.mode === "dark";
  return (
    <Card
      elevation={0}
      sx={{
        ...cardSx,
        ...sizeSx,
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
          <Box sx={centeredBoxSx}>
            <AnalyticsLoader size={3} />
          </Box>
        ) : hasData ? (
          <BarBody
            currentValue={currentValue}
            targetValue={targetValue}
            barColor={barColor}
            bgBarColor={bgBarColor}
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

export default React.memo(SingleBarComp);
