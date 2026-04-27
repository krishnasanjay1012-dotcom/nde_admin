import { Box, TableCell, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { CommonSelect } from "../../../../components/common/fields";
import CommonDrawer from "../../../../components/common/NDE-Drawer";
import ReusableTable from "../../../../components/common/Table/ReusableTable";
import CustomPagination from "../../../../components/common/Table/TablePagination";
import { useGetComponentPreviewDetails } from "../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../DashboardLoader";

/* ---------------- constants ---------------- */

const KPI_BASIC = new Set(["kpi_standard", "kpi_growth", "kpi_basic"]);
const KPI_RANK = "kpi_rankings";

const INVALID_STRINGS = new Set(["undefined", "null", "nan", ""]);

/* ---------------- api helpers ---------------- */

const resolveApi = ({ itemType, type }) => {
  if (itemType !== "kpi") return "count-data-list";
  if (KPI_BASIC.has(type)) return "count-data-list";
  if (type === KPI_RANK) return "rankings-data-list";
  return "scorecard-data-list";
};

const resolveModule = (itemType) =>
  itemType === "targetMeter" ? "target" : itemType;

const resolveIdParams = (itemType, id) => {
  if (itemType === "chart") return { chartId: id };
  if (itemType === "kpi") return { kpiId: id };
  return { targetId: id };
};

/* ---------------- normalization ---------------- */

const isISODate = (v) =>
  typeof v === "string" &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(v);

const formatDate = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
};

const normalize = (v) => {
  if (v == null) return null;

  if (typeof v === "string") {
    const trimmed = v;
    const lower = trimmed.toLowerCase();

    if (!trimmed || INVALID_STRINGS.has(lower)) return null;

    if (isISODate(trimmed)) return formatDate(trimmed);

    return trimmed;
  }

  return v;
};

const isValidKey = (key) => {
  if (!key) return false;
  const k = String(key).trim().toLowerCase();
  return !INVALID_STRINGS.has(k);
};

const formatHeader = (key) =>
  key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

/* ---------------- data sanitation ---------------- */

const sanitizeRow = (row) => {
  const clean = {};

  for (const key in row) {
    if (!isValidKey(key)) continue;
    clean[key] = normalize(row[key]);
  }

  return clean;
};

/* ---------------- dropdown options ---------------- */

const buildOptions = (items = []) => {
  if (!items.length) return { l1: [], l2: [], hasL2: false };

  const l1Map = new Map();
  const l2Map = new Map();
  let hasL2 = false;

  for (const it of items) {
    const v1 = normalize(it?.label ?? it?.x1 ?? it?.x ?? it?.grouping1);
    if (v1 && !l1Map.has(v1)) {
      l1Map.set(v1, { label: v1, value: v1 });
    }

    const v2 = normalize(it?.x2 ?? it?.y ?? it?.grouping2);
    if (v2) {
      hasL2 = true;
      if (!l2Map.has(v2)) {
        l2Map.set(v2, { label: v2, value: v2 });
      }
    }
  }

  return {
    l1: [...l1Map.values()],
    l2: [...l2Map.values()],
    hasL2,
  };
};

/* ---------------- table columns ---------------- */

const buildColumns = (rows) => {
  if (!rows.length) return [];

  const keys = Object.keys(rows[0]).filter(isValidKey);

  return keys.map((key) => ({
    id: key,
    accessorKey: key,
    header: formatHeader(key),
    cell: ({ row }) => {
      const value = row.original?.[key];

      return (
        <TableCell
          sx={{
            border: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: 220,
          }}
        >
          {value ?? "-"}
        </TableCell>
      );
    },
  }));
};

/* ---------------- component ---------------- */

export default function DetailViewDrawer({
  handleDrawerClose,
  open,
  id,
  itemType,
  type,
  items = [],
  name,
}) {
  const [label1, setLabel1] = useState(null);
  const [label2, setLabel2] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [limit, setLimit] = useState(10);

  /* ---------- dropdown ---------- */

  const { l1, l2, hasL2 } = useMemo(() => buildOptions(items), [items]);

  useEffect(() => {
    if (!items.length && open) return;

    const first = items[0];

    setLabel1(
      normalize(first?.label ?? first?.x1 ?? first?.x ?? first?.grouping1),
    );
    setLabel2(normalize(first?.x2 ?? first?.y ?? first?.grouping2));
  }, [open]);

  /* ---------- query ---------- */

  const queryParams = useMemo(
    () => ({
      ...resolveIdParams(itemType, id),
      ...(itemType === "chart"
        ? { groupValue1: label1, groupValue2: label2 }
        : {}),
      ...(itemType === "kpi" ? { groupValue: label1 } : {}),
      module: resolveModule(itemType),
      api: resolveApi({ itemType, type }),
      enabled: Boolean(id && open),
      pageLimit: limit,
    }),
    [itemType, id, label1, label2, type, open, limit],
  );

  const {
    data,
    isLoading,
    isFetching,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useGetComponentPreviewDetails(queryParams);

  /* ---------- derived ---------- */

  const page = data?.pages?.[pageIndex];

  // sanitize once per page (O(n))
  const rows = useMemo(() => (page?.data || []).map(sanitizeRow), [page]);

  const columns = useMemo(() => buildColumns(rows), [rows]);

  const pagination = page?.pagination || {
    page: 1,
    totalPages: 1,
    total: 0,
    limit,
  };

  const currentValue = page?.currentValue;

  const isBusy =
    isLoading || isFetching || isFetchingNextPage || isFetchingPreviousPage;

  /* ---------- pagination ---------- */

  const handlePageChange = async (_, nextIndex) => {
    if (data?.pages?.[nextIndex]) {
      setPageIndex(nextIndex);
      return;
    }

    if (nextIndex > pageIndex && hasNextPage) {
      await fetchNextPage();
      setPageIndex(nextIndex);
      return;
    }

    if (nextIndex < pageIndex && hasPreviousPage) {
      await fetchPreviousPage();
      setPageIndex(nextIndex);
    }
  };

  /* ---------- render ---------- */

  return (
    <CommonDrawer
      open={open}
      title={` ${name} - Detail View`}
      onClose={() => {
        handleDrawerClose();
        setLabel1("");
        setLabel2("");
        setPageIndex(0);
        setLimit(10);
      }}
      width={800}
      p={0}
      children={
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {" "}
          <Box
            sx={{
              display: "flex",
              gap: 1,
              px: 1,
              borderRadius: "8px 8px 0 0",
              alignItems: "center",
              bgcolor: "background.default",
              height: 60,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {l1?.length ? (
              <CommonSelect
                width="35%"
                value={label1}
                clearable={false}
                searchable
                height={40}
                mt={2}
                onChange={(e) => {
                  if (e.target.value) {
                    setPageIndex(0);

                    setLabel1(e.target.value);
                  }
                }}
                options={l1}
              />
            ) : (
              ""
            )}

            {hasL2 && (
              <CommonSelect
                width="35%"
                value={label2}
                searchable
                clearable={false}
                mt={2}
                height={40}
                onChange={(e) => {
                  if (e.target.value) {
                    setPageIndex(0);

                    setLabel1(e.target.value);
                  }
                }}
                options={l2}
              />
            )}

            <Typography sx={{ fontSize: 14 }}>
              Total : {currentValue ?? "-"}
            </Typography>
          </Box>
          {/* Table */}
          <Box flex={1} display="flex" flexDirection="column">
            <Box
              flex={1}
              overflow="auto"
              sx={{ borderBottom: "1px solid", borderColor: "divider" }}
            >
              {isBusy ? (
                <Box
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <AnalyticsLoader size={3} />
                </Box>
              ) : (
                <ReusableTable columns={columns} data={rows} />
              )}
            </Box>

            {/* Pagination */}
            <CustomPagination
              count={pagination.total}
              page={pageIndex}
              rowsPerPage={limit}
              onPageChange={handlePageChange}
              onRowsPerPageChange={(e) => setLimit(e.target.value)}
            />
          </Box>
        </Box>
      }
    />
  );
}
