import {
  Box,
  Card,
  CardContent,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";
import { useDashboardChartCard } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";
import NoDataDashboard from "../DashboardNoData";
import OpenDetailView from "../DetailView/OpenDetailView";
import { useState } from "react";
import ChartLegend from "./ChartLegend";
// ─── Static sx objects (defined once, not on every render) ───────────────────

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

const chartBoxSx = {
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  mt: 1,
  height: "100%",
  overflow: "hidden",
};

const scrollAreaSx = {
  flex: 1,
  minHeight: 0,
  overflowX: "auto",
  overflowY: "auto",
  scrollbarGutter: "stable",
  "&::-webkit-scrollbar": { width: 6, height: 6 },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "transparent",
    borderRadius: 3,
    transition: "background-color 0.2s",
  },
  "&::-webkit-scrollbar-track": { backgroundColor: "transparent" },
  "&:hover::-webkit-scrollbar-thumb": {
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  scrollbarWidth: "thin",
  scrollbarColor: "transparent transparent",
  "&:hover": {
    scrollbarColor: "rgba(0,0,0,0.25) transparent",
  },
};

const rowWrapSx = { display: "flex", flexDirection: "column" };

const rowBoxSx = { display: "flex", alignItems: "center", my: 0.25 };

const rowLabelSx = {
  textAlign: "right",
  mr: 1,
  color: "text.secondary",
  flexShrink: 0,

  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  minWidth: 0,
};

const footerBoxSx = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexShrink: 0,
  pt: 1,
  mt: 1,
  borderTop: "1px solid",
  borderColor: "divider",
};

const legendRowSx = { display: "flex", alignItems: "center", gap: 0.5 };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getColor(intensity, palette) {
  if (intensity <= 0) return palette.light;
  if (intensity < 0.33) return palette.light;
  if (intensity < 0.67) return palette.main;
  return palette.dark;
}

function buildMatrix(items) {
  const hasXY = items.some((i) => i.x !== undefined && i.y !== undefined);

  if (!hasXY) {
    const maxVal = Math.max(...items.map((i) => i.value ?? 0), 1);
    return {
      cols: ["Value"],
      rows: items.map((i) => i.y ?? i.label ?? i.name ?? ""),
      matrix: items.map((i) => [(i.value ?? 0) / maxVal]),
      total: items.reduce((s, i) => s + (i.value ?? 0), 0),
    };
  }

  const colSet = [...new Set(items.map((i) => i.x))];
  const rowSet = [...new Set(items.map((i) => i.y))];
  const maxVal = Math.max(...items.map((i) => i.value ?? 0), 1);

  const lookup = {};
  items.forEach((i) => {
    lookup[`${i.y}|${i.x}`] = (i.value ?? 0) / maxVal;
  });

  const matrix = rowSet.map((r) => colSet.map((c) => lookup[`${r}|${c}`] ?? 0));
  const total = items.reduce((s, i) => s + (i.value ?? 0), 0);

  return { cols: colSet, rows: rowSet, matrix, total };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChartBody = React.memo(({ items, palette }) => {
  const { cols, rows, matrix, total } = useMemo(
    () => buildMatrix(items),
    [items],
  );

  const cellW = Math.min(64, Math.max(30, Math.floor(240 / cols.length)));
  const cellH = 30;
  const cellGap = 4;

  const getMaxTextWidth = (texts, font) => {
    if (!texts || !texts.length) return 0;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return 0;

    ctx.font = font;

    let max = 0;
    for (let i = 0; i < texts.length; i++) {
      const w = ctx.measureText(texts[i] || "").width;
      if (w > max) max = w;
    }

    return Math.ceil(max);
  };

  const theme = useTheme(); // you already use it in parent, reuse or pass down

  const rowLabelWidth = useMemo(() => {
    if (!rows || !rows.length) return 0;

    const font = `${theme.typography.caption.fontWeight} ${theme.typography.caption.fontSize} ${theme.typography.caption.fontFamily}`;

    const width = getMaxTextWidth(rows, font);

    return width + 12; // padding buffer
  }, [rows, theme.typography.caption]);
  const rawLookup = useMemo(() => {
    const map = {};
    items.forEach((i) => {
      map[`${i.y}|${i.x}`] = i.value ?? 0;
    });
    return map;
  }, [items]);

  return (
    <Box sx={chartBoxSx}>
      {/* ── Scrollable content area ── */}
      <Box sx={scrollAreaSx}>
        {/* Column headers */}
        <Box
          sx={{
            display: "flex",
            gap: `${cellGap}px`,
            mb: 0.5,
            ml: `${rowLabelWidth + 8}px`,
          }}
        >
          {cols.map((c) => (
            <Typography
              key={c}
              variant="caption"
              color="text.secondary"
              sx={{
                width: cellW,
                textAlign: "center",
                flexShrink: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              noWrap
            >
              {c}
            </Typography>
          ))}
        </Box>

        {/* Rows */}
        <Box sx={rowWrapSx}>
          {rows.map((r, i) => (
            <Box
              key={r}
              sx={{ ...rowBoxSx, gap: `${cellGap}px`, mb: `${cellGap}px` }}
            >
              {/* Row label */}
              <Typography
                variant="caption"
                sx={{ ...rowLabelSx, width: rowLabelWidth, flexShrink: 0 }}
                noWrap
              >
                {r}
              </Typography>

              {/* Cells */}
              {cols.map((c, j) => {
                const intensity = matrix[i]?.[j] ?? 0;
                const bg = getColor(intensity, palette);
                const rawVal = rawLookup[`${r}|${c}`] ?? 0;
                return (
                  <Tooltip key={c} title={`${r} · ${c}: ${rawVal}`}>
                    <Box
                      sx={{
                        width: cellW,
                        height: cellH,
                        bgcolor: bg,
                        borderRadius: 0.5,
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "default",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#fff",
                          lineHeight: 1,
                          userSelect: "none",
                        }}
                      >
                        {rawVal}
                      </Typography>
                    </Box>
                  </Tooltip>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ── Sticky footer — always pinned at bottom, never scrolls ── */}
      <Box sx={footerBoxSx}>
        <Typography variant="caption" color="text.secondary">
          {total.toLocaleString()} activities
        </Typography>
        <Box sx={legendRowSx}>
          <Typography variant="caption" color="text.secondary">
            Less
          </Typography>
          {[palette.light, palette.main, palette.dark].map((bg, idx) => (
            <Box
              key={idx}
              sx={{ width: 10, height: 10, bgcolor: bg, borderRadius: 0.2 }}
            />
          ))}
          <Typography variant="caption" color="text.secondary">
            More
          </Typography>
        </Box>
      </Box>
    </Box>
  );
});

// ─── Main component ───────────────────────────────────────────────────────────

function HeatMapComp({ data = {}, disableDetails, id }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: content, isFetching } = useDashboardChartCard({ id });
  const [hiddenMap, setHiddenMap] = useState({});

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const palette = theme.palette.primary;
  const rawItems = useMemo(
    () => (source?.items?.length ? source.items : data?.items || []),
    [source?.items, data?.items],
  );

  // Treat rows as series
  const seriesKeys = useMemo(
    () => [...new Set(rawItems.map((i) => i.y))],
    [rawItems],
  );

  const toggleItem = (key) => {
    setHiddenMap((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const items = useMemo(() => {
    return rawItems.filter((item) => !hiddenMap[item.y]);
  }, [rawItems, hiddenMap]);
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
      <CardContent sx={cardContentSx}>
        <OpenDetailView disableDetails={disableDetails} data={source} />

        {seriesKeys.length > 0 && (
          <ChartLegend
            seriesKeys={seriesKeys}
            colors={[theme.palette.primary.main]}
            hiddenMap={hiddenMap}
            toggleItem={toggleItem}
          />
        )}
        {id && isFetching ? (
          <Box sx={centeredBoxSx}>
            <AnalyticsLoader size={3} />
          </Box>
        ) : items?.length ? (
          <ChartBody items={items} palette={palette} />
        ) : (
          <Box sx={centeredBoxSx}>
            <NoDataDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(HeatMapComp);
