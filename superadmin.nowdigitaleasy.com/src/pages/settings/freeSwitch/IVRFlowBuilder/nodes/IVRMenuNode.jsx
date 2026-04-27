import { memo, useCallback } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import GridViewIcon from "@mui/icons-material/GridView";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useIVRFlowStore } from "../store/ivrFlowStore";

const IVRMenuNode = memo(({ id, data, selected }) => {
  const theme = useTheme();
  const deleteNode = useIVRFlowStore((s) => s.deleteNode);

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      deleteNode(id);
    },
    [id, deleteNode],
  );

  const keypresses = data.keypresses || [];

  return (
    <Box
      sx={{
        width: 260,
        bgcolor: theme.palette.background.paper,
        borderRadius: "10px",
        border: `2px solid ${selected ? theme.palette.warning.main : theme.palette.divider}`,
        boxShadow: selected
          ? `0 0 0 3px ${alpha(theme.palette.warning.main, 0.18)}`
          : theme.shadows[2],
        overflow: "hidden",
        transition: "border-color 0.18s, box-shadow 0.18s",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{
          background: theme.palette.primary.main,
          width: theme.spacing(1.5),
          height: theme.spacing(1.5),
          border: `2px solid ${theme.palette.common.white}`,
        }}
      />

      {/* blue top */}
      <Box
        sx={{
          height: theme.spacing(0.625),
          bgcolor: theme.palette.primary.main,
        }}
      />

      {/* header */}
      <Box
        sx={{
          px: 1.5,
          py: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <GridViewIcon
          sx={{
            fontSize: "1rem",
            color: theme.palette.primary.main,
            flexShrink: 0,
          }}
        />
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, flex: 1, color: theme.palette.text.primary }}
          noWrap
        >
          {data.name || "IVR Node Component"}
        </Typography>
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{ flexShrink: 0, p: 0.25 }}
        >
          <CloseIcon
            sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }}
          />
        </IconButton>
      </Box>

      <Divider />

      {/* keypress rows */}
      <Box sx={{ px: 1.5, py: 1 }}>
        {keypresses.length === 0 ? (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            No keypresses yet
          </Typography>
        ) : (
          keypresses.map((kp) => (
            <Box
              key={kp.key}
              sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.4 }}
            >
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                Press
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, color: theme.palette.text.primary }}
              >
                {kp.key}
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: theme.palette.text.secondary }}
              >
                for
              </Typography>
              <ArrowForwardIcon
                sx={{ fontSize: "0.8rem", color: theme.palette.text.disabled }}
              />
              {kp.targetName ? (
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 500, color: theme.palette.text.primary }}
                  noWrap
                >
                  {kp.targetName}
                </Typography>
              ) : kp.action ? (
                <Typography
                  variant="body1"
                  sx={{ color: theme.palette.primary.main, fontWeight: 500 }}
                  noWrap
                >
                  {_actionShortLabel(kp.action)}
                </Typography>
              ) : null}
            </Box>
          ))
        )}
      </Box>

      {/* key badges row */}
      {keypresses.length > 0 && (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              borderTop: `1px solid ${theme.palette.divider}`,
            }}
          >
            {keypresses.map((kp, idx) => (
              <Box
                key={kp.key}
                sx={{
                  flex: 1,
                  textAlign: "center",
                  py: 0.75,
                  borderRight:
                    idx < keypresses.length - 1
                      ? `1px solid ${theme.palette.divider}`
                      : "none",
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ fontWeight: 600, color: theme.palette.text.secondary }}
                >
                  {kp.key}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* one source handle */}
      {keypresses.map((kp, idx) => {
        const total = keypresses.length;
        const pct = total === 1 ? 50 : 10 + (80 / (total - 1)) * idx;
        return (
          <Handle
            key={kp.key}
            type="source"
            position={Position.Bottom}
            id={`key-${kp.key}`}
            style={{
              left: `${pct}%`,
              background: theme.palette.primary.main,
              width: theme.spacing(1.5),
              height: theme.spacing(1.5),
              border: `2px solid ${theme.palette.common.white}`,
            }}
          />
        );
      })}
    </Box>
  );
});

function _actionShortLabel(action) {
  const map = {
    ivrMenu: "IVR Menu",
    ivrConnectUser: "Connect to User",
    ivrConnectTeam: "Connect to Team",
    ivrPlayAudio: "Play Audio",
    ivrHangup: "Hangup",
  };
  return map[action] || action;
}

export default IVRMenuNode;
