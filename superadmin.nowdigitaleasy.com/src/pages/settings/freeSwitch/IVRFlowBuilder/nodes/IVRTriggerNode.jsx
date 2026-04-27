import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Box, Typography, Divider, useTheme, alpha } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const IVRTriggerNode = memo(({ data, selected }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: theme.palette.background.paper,
        borderRadius: "10px",
        border: `2px solid ${selected ? theme.palette.success.main : theme.palette.success.light}`,
        boxShadow: selected
          ? `0 0 0 3px ${alpha(theme.palette.success.main, 0.13)}`
          : theme.shadows[2],
        overflow: "hidden",
        transition: "border-color 0.18s, box-shadow 0.18s",
      }}
    >
      {/* green top */}
      <Box sx={{ height: 5, bgcolor: theme.palette.success.main }} />

      {/* Header */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: `2px solid ${theme.palette.success.main}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PlayCircleOutlineIcon
            sx={{ fontSize: "1rem", color: theme.palette.success.main }}
          />
        </Box>
        <Typography
          variant="body1"
          sx={{
            fontWeight: 600,
            color: theme.palette.success.main,
            textDecoration: "underline",
          }}
        >
          {data.name || "Trigger"}
        </Typography>
      </Box>

      <Divider />

      {/* body */}
      <Box sx={{ px: 1.5, py: 1.25 }}>
        <Typography variant="body1" sx={{ color: theme.palette.text.primary }}>
          Incoming call on{" "}
          <Box component="span" sx={{ fontWeight: 600 }}>
            → {data.phoneNumber || ""}
          </Box>
        </Typography>
      </Box>

      <Divider />

      {/* footer */}
      <Box sx={{ px: 1.5, py: 0.75, textAlign: "center" }}>
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
        >
          Incoming call
        </Typography>
      </Box>

      {/* Output handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="out"
        style={{
          background: theme.palette.success.main,
          width: theme.spacing(1.5),
          height: theme.spacing(1.5),
          border: `2px solid ${theme.palette.common.white}`,
        }}
      />
    </Box>
  );
});

export default IVRTriggerNode;
