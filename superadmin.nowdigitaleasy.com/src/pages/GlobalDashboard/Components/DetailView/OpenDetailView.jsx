import { Box, Tooltip, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import DetailViewDrawer from "./DetailViewDrawer";

export default function OpenDetailView({ data, disableDetails = false }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  let label = data?.metric?.label || data?.measure?.label;
  const fullTitle = `${data?.name ?? ""} ${label ? ` (${label})` : ""}`;

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const id = data?._id || data?.chartId || data?.kpiId;
  const type = data?.category || data?.chartType || data?.type;
  return (
    <Box>
      <Typography
        onClick={() => {
          if (disableDetails) return;
          if (
            id && ["chart", "kpi"].includes(data?.itemType)
              ? data?.itemType === "kpi"
                ? ["kpi_scorecard", "kpi_rankings"]?.includes(data?.category)
                  ? data?.items?.length
                  : true
                : data?.items?.length
              : true
          ) {
            setOpen(true);
          }
        }}
        noWrap
        sx={{
          fontSize: "12px",
          fontWeight: 600,
          color: theme.palette.text.secondary,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          overflow: "hidden",
          ...((
            id && ["chart", "kpi"].includes(data?.itemType)
              ? data?.itemType === "kpi"
                ? ["kpi_scorecard", "kpi_rankings"]?.includes(data?.category)
                  ? data?.items?.length
                  : true
                : data?.items?.length
              : true
          )
            ? {
                ":hover": {
                  cursor: disableDetails ? "default" : "pointer",
                  color: disableDetails ? "" : theme.palette.primary.main,
                },
              }
            : {}),
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <Tooltip title={data?.name}>{fullTitle}</Tooltip>
      </Typography>

      <DetailViewDrawer
        id={id}
        open={open}
        itemType={data?.itemType}
        type={type}
        name={data?.name}
        items={data?.items ?? []}
        handleDrawerClose={handleDrawerClose}
      />
    </Box>
  );
}
