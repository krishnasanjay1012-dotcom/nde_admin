import {
  BarChartRounded,
  CachedRounded,
  Edit,
  Close,
  Check,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Fade,
  IconButton,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { memo, useMemo, useState, useRef } from "react";

import Masonry from "@mui/lab/Masonry";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDashboardContentList } from "../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "./Components/DashboardLoader";
import MoreOptions from "./Components/MoreOptions";
import {
  CHARTS,
  KPI,
  TARGET_METERS,
} from "./CreateComponent/Create/components/data/configureData";
import OpenDrawer from "./CreateComponent/OpenDrawer";
import { EditDashboardPositionUpdate } from "../../services/global-dashboard/global-dashboard";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_COMPONENTS = 12;

const COMPONENT_MAP = [...CHARTS, ...TARGET_METERS, ...KPI].reduce(
  (acc, { key, component }) => {
    acc[key] = component;
    return acc;
  },
  {},
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns the active column count based on current breakpoint.
 * Mirrors the Masonry `columns` prop: { xs:1, sm:1, md:2, lg:3, xl:3 }
 */
function useActiveColumns() {
  const isXl = useMediaQuery((theme) => theme.breakpoints.up("xl"));
  const isLg = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  if (isXl || isLg) return 3;
  if (isMd) return 2;
  return 1;
}

/**
 * Computes the column span for each item.
 * Last-row items are spread evenly to fill remaining columns.
 */
function computeSpans(items, cols) {
  const total = items.length;
  const remainder = total % cols;

  if (remainder === 0) {
    // All rows are full — no spanning needed
    return items.map(() => 1);
  }

  const lastRowStart = total - remainder;

  return items.map((_, index) => {
    if (index < lastRowStart) return 1;

    // Distribute columns evenly among last-row items
    // e.g. 1 item left in 3-col → span 3; 2 items left in 3-col → span 1 (no change needed visually but you can force span)
    return remainder === 1 ? cols : Math.floor(cols / remainder);
  });
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function EmptyState() {
  const theme = useTheme();

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "70vh",
          borderRadius: 2,
          bgcolor: "background.paper",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, sm: 6 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            borderRadius: 2,
            width: "100%",
            height: "100%",
            background: `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.default, 0.5)} 100%)`,
            boxShadow: `0 12px 40px -12px ${alpha(theme.palette.text.primary, 0.08)}`,
          }}
        >
          <Box
            sx={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              backgroundColor: alpha(theme.palette.primary.main, 0.08),
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              mb: 3,
              boxShadow: `0 0 0 10px ${alpha(theme.palette.primary.main, 0.03)}`,
            }}
          >
            <BarChartRounded sx={{ fontSize: 44, color: "primary.main" }} />
          </Box>

          <Typography
            variant="h5"
            sx={{ fontWeight: 700, mb: 1.5, letterSpacing: "-0.5px" }}
          >
            No components added yet
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mb: 4,
              lineHeight: 1.6,
              px: { xs: 0, sm: 2 },
            }}
          >
            Your dashboard is currently empty. Start building your custom view
            by adding components.
          </Typography>

          <OpenDrawer smallButton={false} />
        </Paper>
      </Box>
    </Fade>
  );
}

const DashboardItem = memo(function DashboardItem({ disableDetails, item }) {
  const Component = COMPONENT_MAP[item?.category];
  if (!Component) return null;
  return (
    <Component
      itemType={item?.itemType}
      id={item._id}
      disableDetails={disableDetails}
    />
  );
});

function LoadingState() {
  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        width: "100%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AnalyticsLoader />
    </Box>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function GlobalDashboard() {
  const { data, isFetching } = useDashboardContentList();
  const queryClient = useQueryClient();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const activeColumns = useActiveColumns();

  const [isEditMode, setIsEditMode] = useState(false);
  const [localItems, setLocalItems] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const dragItemIndex = useRef(null);
  const dragOverItemIndex = useRef(null);
  const scrollContainerRef = useRef(null);

  const handleContainerDragOver = (e) => {
    if (!isEditMode) return;
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const rect = container.getBoundingClientRect();
      const threshold = 80; // Distance from edge in px to trigger scroll

      const distanceToTop = e.clientY - rect.top;
      const distanceToBottom = rect.bottom - e.clientY;

      if (distanceToTop < threshold) {
        container.scrollTop -= Math.max(5, 20 - distanceToTop / 4); // Speed scales with closeness to edge
      } else if (distanceToBottom < threshold) {
        container.scrollTop += Math.max(5, 20 - distanceToBottom / 4);
      }
    }
  };

  const dashboardItems = useMemo(() => {
    if (!data) return [];
    // Sort items initially by displayOrder if available
    return [...data].sort(
      (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0),
    );
  }, [data]);

  const displayedItems = isEditMode ? localItems : dashboardItems;

  const spans = useMemo(
    () => computeSpans(displayedItems, activeColumns),
    [displayedItems, activeColumns],
  );

  const handleDragStart = (e, index) => {
    dragItemIndex.current = index;
    setDraggedIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
      // Adding empty text keeps Firefox happy
      e.dataTransfer.setData("text/html", "");
    }
  };

  const handleDragEnter = (index) => {
    dragOverItemIndex.current = index;
    if (dragItemIndex.current !== null && dragItemIndex.current !== index) {
      const newItems = [...localItems];
      const draggedItemContent = newItems[dragItemIndex.current];
      newItems.splice(dragItemIndex.current, 1);
      newItems.splice(index, 0, draggedItemContent);
      dragItemIndex.current = index;
      setDraggedIndex(index);
      setLocalItems(newItems);
    }
  };

  const handleDragEnd = () => {
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
    setDraggedIndex(null);
  };

  const handleSave = () => {
    // Generate payload with updated orders

    const payload = localItems.map((item, index) => ({
      id: item.widgetId,
      displayOrder: index + 1,
      width: item?.width,
      height: item?.height,
    }));

    mutate(payload);

    // Ideally, wait for the actual API mutation to complete.
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => EditDashboardPositionUpdate(data),
    onSuccess: () => {
      let updated = localItems?.map((item, index) => ({
        ...item,
        displayOrder: index + 1,
      }));

      queryClient.setQueryData(["getDashboardContentList"], updated);
      setIsEditMode(false);
      setLocalItems([]);
      setDraggedIndex(null);
      dragItemIndex.current = null;
      dragOverItemIndex.current = null;
    },
    onError: () => {
      setIsEditMode(false);
      setLocalItems([]);
      setDraggedIndex(null);
      dragItemIndex.current = null;
      dragOverItemIndex.current = null;
    },
  });

  const handleCancel = () => {
    setIsEditMode(false);
    setLocalItems([]);
    setDraggedIndex(null);
    dragItemIndex.current = null;
    dragOverItemIndex.current = null;
  };

  if (!dashboardItems.length && !isFetching) return <EmptyState />;

  return (
    <Box sx={{ height: "100%", borderRadius: 2 }}>
      <Box
        sx={{
          display: "flex",
          height: "60px",
          alignItems: "center",
          borderRadius: "12px 12px 0 0",
          bgcolor: "background.paper",
          px: 2,
          // py: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "16px" }}>
            {isEditMode ? "Edit" : "Dashboard"}
          </Typography>

          {!isEditMode && !isFetching && (
            <IconButton
              sx={{
                p: 0.5,
                m: 0,
              }}
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ["getDashboardContentList"],
                });
              }}
            >
              <CachedRounded fontSize="small" />
            </IconButton>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {isEditMode ? (
            <>
              <Button
                size="small"
                variant="outlined"
                color="inherit"
                onClick={handleCancel}
                startIcon={<Close />}
              >
                Cancel
              </Button>
              <Button
                disabled={isPending}
                size="small"
                variant="contained"
                color="primary"
                onClick={handleSave}
                startIcon={
                  isPending ? (
                    <CircularProgress sx={{ color: "white" }} size={"1.9vh"} />
                  ) : (
                    <Check />
                  )
                }
              >
                Save
              </Button>
            </>
          ) : (
            !isFetching && (
              <>
                <IconButton
                  sx={{
                    p: 0.5,
                    m: 0,
                  }}
                  onClick={() => {
                    setLocalItems([...dashboardItems]);
                    setIsEditMode(true);
                  }}
                >
                  <Edit fontSize="small" />
                </IconButton>
                <OpenDrawer
                  currentCount={dashboardItems?.length}
                  MAX_COMPONENTS={MAX_COMPONENTS}
                  disable={dashboardItems.length >= MAX_COMPONENTS}
                />
              </>
            )
          )}
        </Box>
      </Box>

      <Box
        ref={scrollContainerRef}
        onDragOver={handleContainerDragOver}
        sx={{
          borderRadius: "12px 12px 0 0",
          bgcolor: "background.paper",
          height: "calc(100% - 60px)",
          p: 0.8,
          overflow: "auto",
        }}
      >
        {isFetching ? (
          <LoadingState />
        ) : (
          <Masonry
            sx={{ m: 0, p: 0 }}
            columns={{ md: 2, sm: 1, xs: 1, lg: 3, xl: 3 }}
            spacing={2}
          >
            {displayedItems.map((item, index) => (
              <Box
                key={item._id}
                draggable={isEditMode}
                onDragStart={(e) => isEditMode && handleDragStart(e, index)}
                onDragEnter={() => isEditMode && handleDragEnter(index)}
                onDragEnd={isEditMode ? handleDragEnd : undefined}
                onDragOver={(e) => {
                  if (isEditMode) e.preventDefault();
                }}
                sx={{
                  position: "relative",
                  gridColumnEnd: `span ${spans[index]}`,
                  opacity: draggedIndex === index ? 0.4 : 1,
                  cursor: isEditMode ? "grab" : "default",
                  "&:active": {
                    cursor: isEditMode ? "grabbing" : "default",
                  },
                  "&:hover .actions": {
                    opacity: isEditMode ? 0 : 1,
                    pointerEvents: isEditMode ? "none" : "auto",
                    transform: "translateY(0)",
                  },
                  ...(isEditMode && {
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    border: `1px dashed ${theme.palette.divider}`,
                    borderRadius: 2,
                    "&:hover": {
                      boxShadow: `0 8px 24px ${alpha(theme.palette.text.primary, 0.12)}`,
                      transform: "scale(1.01)",
                    },
                  }),
                }}
              >
                {/* Prevent child interaction in edit mode */}
                {isEditMode && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      zIndex: 10,
                      backgroundColor: "transparent",
                    }}
                  />
                )}

                <Box
                  className="actions"
                  sx={{
                    position: "absolute",
                    top: 5,
                    right: 10,
                    zIndex: 1,
                    display: "flex",
                    gap: 1,
                    opacity: 0,
                    pointerEvents: "none",
                    transform: "translateY(-4px)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <IconButton
                    sx={{
                      p: 0,
                      m: 0,
                      bgcolor: isDark
                        ? "background.paper"
                        : "background.default",
                    }}
                    onClick={() => {
                      queryClient.invalidateQueries({
                        predicate: (query) => {
                          const [key, params] = query.queryKey || [];
                          if (!key || !params) return false;

                          if (item?.itemType === "kpi") {
                            return (
                              key === `getDashboardKPICard-${item._id}` &&
                              params?.id === item._id
                            );
                          }
                          if (item?.itemType === "targetMeter") {
                            return (
                              key === `getDashboardTargetCard-${item._id}` &&
                              params?.id === item._id
                            );
                          }
                          if (item?.itemType === "chart") {
                            return (
                              key === `getDashboardChartCard-${item._id}` &&
                              params?.id === item._id
                            );
                          }
                          return false;
                        },
                      });
                    }}
                  >
                    <CachedRounded fontSize="small" />
                  </IconButton>
                  <MoreOptions
                    child={<DashboardItem disableDetails={true} item={item} />}
                    data={item}
                  />
                </Box>

                <DashboardItem item={item} />
              </Box>
            ))}
          </Masonry>
        )}
      </Box>
    </Box>
  );
}
