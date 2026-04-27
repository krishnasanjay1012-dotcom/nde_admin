import { memo, useState, useCallback, useRef, useMemo } from "react";
import {
  Box,
  Dialog,
  Divider,
  IconButton,
  Typography,
  useTheme,
  alpha,
  Chip,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
import PhoneCallbackIcon from "@mui/icons-material/PhoneCallback";

import { useIVRFlowStore } from "../../store/ivrFlowStore";
import { LeftPanel } from "./LeftPanel";
import { CenterPanel } from "./CenterPanel";
import { RightPanel } from "./RightPanel";

const NodeConfigDialog = memo(function NodeConfigDialog() {
  const theme = useTheme();

  const selectedNodeId = useIVRFlowStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useIVRFlowStore((s) => s.setSelectedNodeId);
  const deleteBlock = useIVRFlowStore((s) => s.deleteBlock);
  const updateBlockConfig = useIVRFlowStore((s) => s.updateBlockConfig);
  const executionLogs = useIVRFlowStore((s) => s.executionLogs);

  const selectedNode = useIVRFlowStore(
    (s) => s.nodes.find((n) => n.id === s.selectedNodeId) ?? null,
    (prev, next) => {
      if (prev === null && next === null) return true;
      if (prev === null || next === null) return false;
      return prev.id === next.id && prev.data === next.data;
    },
  );

  const upstreamVariables = useMemo(() => {
    if (!selectedNodeId) return [];
    return useIVRFlowStore.getState().getAvailableVariables(selectedNodeId);
  }, [selectedNodeId]);

  const [isMaximized, setIsMaximized] = useState(false);

  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  /*  left panel   */
  const handleLeftResize = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const panel = leftPanelRef.current;
    if (!panel) return;
    const startW = panel.offsetWidth || 260;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (mv) => {
      panel.style.width = `${Math.max(180, Math.min(600, startW + mv.clientX - startX))}px`;
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  /*  right panel  */
  const handleRightResize = useCallback((e) => {
    e.preventDefault();
    const startX = e.clientX;
    const panel = rightPanelRef.current;
    if (!panel) return;
    const startW = panel.offsetWidth || 260;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const onMove = (mv) => {
      panel.style.width = `${Math.max(180, Math.min(600, startW + startX - mv.clientX))}px`;
    };
    const onUp = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const open = !!selectedNodeId;

  const handleClose = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const handleInsertVariable = useCallback((token) => {
    useIVRFlowStore.getState().openMessage(`Variable ${token} copied.`, "info");
  }, []);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: isMaximized ? "100vw" : "82vw",
          maxWidth: isMaximized ? "100vw" : 1200,
          height: isMaximized ? "100vh" : "85vh",
          maxHeight: "100vh",
          borderRadius: isMaximized ? 0 : "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: theme.palette.background.paper,
          boxShadow: isMaximized
            ? "none"
            : `0 32px 80px ${alpha("#000", 0.22)}`,
          transition:
            "width 0.22s cubic-bezier(0.4,0,0.2,1), height 0.22s cubic-bezier(0.4,0,0.2,1), border-radius 0.22s",
          m: isMaximized ? 0 : undefined,
        },
      }}
    >
      {/*  header  */}
      <Box
        sx={{
          px: 2.5,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          bgcolor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexShrink: 0,
          gap: 1.5,
          minHeight: 58,
        }}
      >
        {/* Node identity */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            minWidth: 0,
          }}
        >
          {selectedNode && (
            <>
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "10px",
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <PhoneCallbackIcon
                  sx={{ fontSize: "1.1rem", color: theme.palette.primary.main }}
                />
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    lineHeight: 1.2,
                  }}
                  noWrap
                >
                  {selectedNode.data?.name || "Node"}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    textTransform: "capitalize",
                  }}
                >
                  {selectedNode.data?.blockType} · IVR Flow
                </Typography>
              </Box>
              <Chip
                label={selectedNode.data?.blockType}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 700,
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  borderRadius: "6px",
                  flexShrink: 0,
                  textTransform: "capitalize",
                }}
              />
            </>
          )}
        </Box>

        {/*  buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            flexShrink: 0,
          }}
        >
          {/*  Maximize */}
          <Tooltip title={isMaximized ? "Restore" : "Maximize"}>
            <IconButton
              size="small"
              onClick={() => setIsMaximized((v) => !v)}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                border: `1px solid ${theme.palette.divider}`,
                transition: "all 0.18s",
                "&:hover": {
                  color: theme.palette.primary.main,
                  borderColor: alpha(theme.palette.primary.main, 0.4),
                  bgcolor: alpha(theme.palette.primary.main, 0.06),
                },
              }}
            >
              {isMaximized ? (
                <CloseFullscreenIcon sx={{ fontSize: "0.9rem" }} />
              ) : (
                <OpenInFullIcon sx={{ fontSize: "0.9rem" }} />
              )}
            </IconButton>
          </Tooltip>

          {/* Delete */}
          <Tooltip title="Delete node">
            <IconButton
              size="small"
              onClick={() => {
                deleteBlock(selectedNode?.id);
                setSelectedNodeId(null);
              }}
              sx={{
                width: 32,
                height: 32,
                borderRadius: "8px",
                bgcolor: theme.palette.background.paper,
                color: theme.palette.error.main,
                border: `1px solid ${alpha(theme.palette.error.main, 0.25)}`,
                transition: "all 0.18s",
                "&:hover": {
                  bgcolor: alpha(theme.palette.error.main, 0.08),
                  borderColor: theme.palette.error.main,
                },
              }}
            >
              <DeleteIcon sx={{ fontSize: "0.9rem" }} />
            </IconButton>
          </Tooltip>

          <Divider orientation="vertical" flexItem sx={{ mx: 0.25, my: 0.5 }} />

          {/* Close */}
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              width: 32,
              height: 32,
              borderRadius: "8px",
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.secondary,
              border: `1px solid ${theme.palette.divider}`,
              transition: "all 0.18s",
              "&:hover": {
                color: theme.palette.text.primary,
                borderColor: alpha(theme.palette.text.primary, 0.4),
              },
            }}
          >
            <CloseIcon sx={{ fontSize: "0.95rem" }} />
          </IconButton>
        </Box>
      </Box>

      {/*  body  */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        {/* Left: Variables */}
        <LeftPanel
          leftPanelRef={leftPanelRef}
          upstreamVariables={upstreamVariables}
          onInsert={handleInsertVariable}
        />

        {/*  left resize  */}
        <Box
          onMouseDown={handleLeftResize}
          sx={{
            width: 5,
            cursor: "col-resize",
            bgcolor: theme.palette.divider,
            flexShrink: 0,
            transition: "background-color 0.2s",
            "&:hover": { bgcolor: theme.palette.primary.main },
          }}
        />

        {/* center*/}
        <CenterPanel
          selectedNode={selectedNode}
          updateBlockConfig={updateBlockConfig}
        />

        {/*  right resize  */}
        <Box
          onMouseDown={handleRightResize}
          sx={{
            width: 5,
            cursor: "col-resize",
            bgcolor: theme.palette.divider,
            flexShrink: 0,
            transition: "background-color 0.2s",
            "&:hover": { bgcolor: theme.palette.primary.main },
          }}
        />

        {/* Right */}
        <RightPanel
          rightPanelRef={rightPanelRef}
          selectedNode={selectedNode}
          executionLogs={executionLogs}
        />
      </Box>
    </Dialog>
  );
});

export default NodeConfigDialog;
