import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useMemo, useState } from "react";
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

const tableHeadCellSx = {
  fontSize: "0.7rem",
  fontWeight: 600,
  p: 1,
  position: "sticky",
  top: 0,
  backgroundColor: "background.default",
  zIndex: 0,
  borderBottom: "1px solid",
  borderColor: "divider",
};

const tableBodyCellSx = {
  fontSize: "0.7rem",
  p: 1,
};

const footerBoxSx = {
  pt: 1,
  mt: 1,
  display: "flex",
  justifyContent: "space-between",
  borderTop: "1px solid",
  borderColor: "divider",
};

const tableContainerSx = {
  flex: 1,
  overflowY: "auto",
  overflowX: "auto",
  borderTop: "1px solid",
  borderColor: "divider",
  mt: 2,
};

// ─── Table Body ───────────────────────────────────────────────────────────

const TableBody_ = React.memo(({ items }) => {
  const columns = useMemo(() => {
    if (!items?.length) return [];
    return Object.keys(items[0]);
  }, [items]);

  const numericKey = useMemo(() => {
    if (!items?.length) return null;
    return columns.find(
      (col) => typeof items[0][col] === "number" && col !== "slNo",
    );
  }, [items, columns]);

  const totalCount = useMemo(() => {
    if (!numericKey) return 0;
    return items.reduce((sum, row) => sum + (row[numericKey] ?? 0), 0);
  }, [items, numericKey]);

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <>
      <TableContainer sx={tableContainerSx}>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                "& .MuiTableCell-root": {
                  backgroundColor: isDark
                    ? "background.default"
                    : "background.paper",
                },
              }}
            >
              {columns.map((col) => (
                <TableCell key={col} sx={tableHeadCellSx}>
                  {col.replace(/_/g, " ").toUpperCase()}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {items.map((row, index) => (
              <TableRow key={index}>
                {columns.map((col) => (
                  <TableCell key={col} sx={tableBodyCellSx}>
                    {row[col] ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={footerBoxSx}>
        <Typography variant="caption" color="text.secondary">
          {items.length} rows
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Total: {totalCount}
        </Typography>
      </Box>
    </>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────

function TableChartComp({ data = {}, id, disableDetails }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const { data: content, isFetching } = useDashboardChartCard({ id });

  const source = useMemo(() => (id ? content : data), [id, content, data]);

  const items = useMemo(
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

  // ─── Column detection ───────────────────────────────────────────────────

  const columns = useMemo(() => {
    if (!items?.length) return [];
    return Object.keys(items[0]);
  }, [items]);

  const labelKey = useMemo(() => {
    return columns.find((col) => typeof items?.[0]?.[col] === "string");
  }, [columns, items]);

  const numericKey = useMemo(() => {
    return columns.find(
      (col) => typeof items?.[0]?.[col] === "number" && col !== "slNo",
    );
  }, [columns, items]);

  // ─── Legend sorted low → high ───────────────────────────────────────────

  const legendItems = useMemo(() => {
    if (!items?.length || !numericKey || !labelKey) return [];

    return [...items].sort(
      (a, b) => (a[numericKey] ?? 0) - (b[numericKey] ?? 0),
    );
  }, [items, numericKey, labelKey]);

  // ─── Visibility filter ──────────────────────────────────────────────────

  const visibleItems = useMemo(() => {
    if (!items?.length || !labelKey) return [];
    return items.filter((row) => !hiddenMap[row[labelKey]]);
  }, [items, hiddenMap, labelKey]);

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

        {/* ✅ ChartLegend */}
        {legendItems.length > 0 && (
          <ChartLegend
            seriesKeys={legendItems.map((i) => i[labelKey])}
            colors={legendItems.map(() => theme.palette.primary.main)}
            hiddenMap={hiddenMap}
            toggleItem={toggleItem}
          />
        )}

        {id && isFetching ? (
          <Box sx={centeredBoxSx}>
            <AnalyticsLoader size={3} />
          </Box>
        ) : visibleItems?.length ? (
          <TableBody_ items={visibleItems} />
        ) : (
          <Box sx={centeredBoxSx}>
            <NoDataDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

export default React.memo(TableChartComp);
