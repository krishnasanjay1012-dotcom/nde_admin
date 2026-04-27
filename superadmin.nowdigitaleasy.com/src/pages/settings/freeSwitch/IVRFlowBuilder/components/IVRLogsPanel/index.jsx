import { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Chip,
  Tooltip,
  alpha,
  useTheme,
  Divider,
} from "@mui/material";
import TerminalIcon from "@mui/icons-material/Terminal";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

import { useIVRFlowStore } from "../../store/ivrFlowStore";

/* ── Log entry row ── */
function LogRow({ log, selected, onClick }) {
  const theme = useTheme();

  const statusColor =
    log.status === "success"
      ? theme.palette.success.main
      : log.status === "error"
        ? theme.palette.error.main
        : theme.palette.primary.main;

  const StatusIcon =
    log.status === "success"
      ? CheckCircleIcon
      : log.status === "error"
        ? ErrorIcon
        : AccessTimeIcon;

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        px: 1.5,
        py: 0.75,
        cursor: "pointer",
        bgcolor: selected
          ? alpha(theme.palette.primary.main, 0.08)
          : "transparent",
        borderLeft: `3px solid ${selected ? theme.palette.primary.main : "transparent"}`,
        transition: "all 0.15s",
        "&:hover": {
          bgcolor: theme.palette.background.hover,
        },
      }}
    >
      <StatusIcon
        sx={{ fontSize: "0.9rem", color: statusColor, flexShrink: 0 }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, color: theme.palette.text.primary }}
          noWrap
        >
          {log.blockId || "System"}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary }}
          noWrap
        >
          {log.message || log.type || "Log entry"}
        </Typography>
      </Box>
      {log.duration !== undefined && (
        <Typography
          variant="caption"
          sx={{ color: theme.palette.text.secondary, flexShrink: 0 }}
        >
          {log.duration}ms
        </Typography>
      )}
    </Box>
  );
}

/* ── Log detail pane ── */
function LogDetail({ log }) {
  const theme = useTheme();

  if (!log) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Select a log entry to view details
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, overflow: "auto", p: 1.5 }}>
      <Typography
        variant="caption"
        sx={{ color: theme.palette.grey[3], display: "block", mb: 1 }}
      >
        Log Detail
      </Typography>
      <Box
        component="pre"
        sx={{
          m: 0,
          fontSize: 11,
          fontFamily: "monospace",
          color: theme.palette.text.primary,
          whiteSpace: "pre-wrap",
          wordBreak: "break-all",
          lineHeight: 1.6,
        }}
      >
        {JSON.stringify(log, null, 2)}
      </Box>
    </Box>
  );
}

export default function IVRLogsPanel() {
  const theme = useTheme();
  const { isLogPanelOpen, toggleLogPanel, executionLogs, clearExecutionLogs } =
    useIVRFlowStore();

  const [selectedLogIdx, setSelectedLogIdx] = useState(null);
  const [panelHeight, setPanelHeight] = useState(220);
  const [splitWidth, setSplitWidth] = useState(260);
  const isResizingRef = useRef(false);

  /* ── Height resize (drag top edge) ── */
  const startResizeHeight = useCallback(
    (e) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = panelHeight;
      isResizingRef.current = true;
      document.body.style.cursor = "row-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev) => {
        const newH = Math.max(
          100,
          Math.min(500, startHeight - (ev.clientY - startY)),
        );
        setPanelHeight(newH);
      };
      const onUp = () => {
        isResizingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [panelHeight],
  );

  /* ── Split width resize ── */
  const startResizeWidth = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = splitWidth;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const onMove = (ev) => {
        const newW = Math.max(
          140,
          Math.min(420, startW + (ev.clientX - startX)),
        );
        setSplitWidth(newW);
      };
      const onUp = () => {
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [splitWidth],
  );

  const selectedLog =
    selectedLogIdx !== null ? executionLogs[selectedLogIdx] : null;

  return (
    <Box
      sx={{
        width: "100%",
        height: isLogPanelOpen ? panelHeight : 40,
        bgcolor: theme.palette.background.paper,
        borderTop: `1px solid ${theme.palette.divider}`,
        display: "flex",
        flexDirection: "column",
        zIndex: 10,
        position: "relative",
        transition: "height 0.2s ease-in-out",
        flexShrink: 0,
      }}
    >
      {/* Height resize handle */}
      {isLogPanelOpen && (
        <Box
          onMouseDown={startResizeHeight}
          sx={{
            position: "absolute",
            top: -4,
            left: 0,
            right: 0,
            height: 8,
            cursor: "row-resize",
            zIndex: 20,
            transition: "background-color 0.2s",
            "&:hover": {
              bgcolor: alpha(theme.palette.primary.main, 0.3),
            },
          }}
        />
      )}

      {/* Header */}
      <Box
        sx={{
          height: 40,
          px: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexShrink: 0,
          borderBottom: isLogPanelOpen
            ? `1px solid ${theme.palette.divider}`
            : "none",
        }}
      >
        <TerminalIcon
          sx={{ fontSize: "0.9rem", color: theme.palette.text.secondary }}
        />
        <Typography
          variant="body2"
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          Logs
        </Typography>

        {executionLogs.length > 0 && (
          <Chip
            label={executionLogs.length}
            size="small"
            sx={{
              height: 16,
              fontSize: 10,
              fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: theme.palette.primary.main,
              borderRadius: "4px",
            }}
          />
        )}

        <Box sx={{ flex: 1 }} />

        {/* Clear */}
        {executionLogs.length > 0 && (
          <Tooltip title="Clear logs">
            <IconButton
              size="small"
              onClick={() => {
                clearExecutionLogs();
                setSelectedLogIdx(null);
              }}
              sx={{
                color: theme.palette.text.secondary,
                "&:hover": { color: theme.palette.error.main },
              }}
            >
              <DeleteOutlineIcon sx={{ fontSize: "0.9rem" }} />
            </IconButton>
          </Tooltip>
        )}

        {/* Toggle expand */}
        <Tooltip title={isLogPanelOpen ? "Collapse logs" : "Expand logs"}>
          <IconButton
            size="small"
            onClick={toggleLogPanel}
            sx={{
              color: theme.palette.text.secondary,
              "&:hover": { color: theme.palette.text.primary },
            }}
          >
            {isLogPanelOpen ? (
              <ExpandMoreIcon sx={{ fontSize: "1rem" }} />
            ) : (
              <ExpandLessIcon sx={{ fontSize: "1rem" }} />
            )}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Body (log list + detail) */}
      {isLogPanelOpen && (
        <Box
          sx={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}
        >
          {/* Log list */}
          <Box sx={{ width: splitWidth, overflow: "auto", flexShrink: 0 }}>
            {executionLogs.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  p: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary }}
                >
                  No logs yet. Run the flow to see logs.
                </Typography>
              </Box>
            ) : (
              executionLogs.map((log, idx) => (
                <LogRow
                  key={idx}
                  log={log}
                  selected={selectedLogIdx === idx}
                  onClick={() =>
                    setSelectedLogIdx(selectedLogIdx === idx ? null : idx)
                  }
                />
              ))
            )}
          </Box>

          {/* Resize handle (split) */}
          <Box
            onMouseDown={startResizeWidth}
            sx={{
              width: 5,
              cursor: "col-resize",
              bgcolor: theme.palette.divider,
              flexShrink: 0,
              transition: "background-color 0.2s",
              "&:hover": { bgcolor: theme.palette.primary.main },
            }}
          />

          {/* Detail pane */}
          <Box sx={{ flex: 1, overflow: "auto", minWidth: 0 }}>
            <LogDetail log={selectedLog} />
          </Box>
        </Box>
      )}
    </Box>
  );
}
