import { useCallback, useRef, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ConnectionLineType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box, useTheme, IconButton, alpha, Tooltip } from "@mui/material";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";

import IVRTriggerNode from "../nodes/IVRTriggerNode";
import IVRMenuNode from "../nodes/IVRMenuNode";
import IVRActionNode from "../nodes/IVRActionNode";
import IVREdge from "../edges/IVREdge";
import { useIVRFlowStore } from "../store/ivrFlowStore";
import { IVR_NODE_TYPES } from "../catalog";

/* ── Node type  */
const nodeTypes = {
  [IVR_NODE_TYPES.TRIGGER]: IVRTriggerNode,
  [IVR_NODE_TYPES.IVR_MENU]: IVRMenuNode,
  [IVR_NODE_TYPES.CONNECT_USER]: IVRActionNode,
  [IVR_NODE_TYPES.CONNECT_TEAM]: IVRActionNode,
  [IVR_NODE_TYPES.PLAY_AUDIO]: IVRActionNode,
  [IVR_NODE_TYPES.HANGUP]: IVRActionNode,
};

const edgeTypes = {
  ivrEdge: IVREdge,
};

export default function IVRCanvas({ phoneNumber }) {
  const theme = useTheme();
  const [isMiniMapVisible, setIsMiniMapVisible] = useState(false);
  const { fitView } = useReactFlow();

  const nodes = useIVRFlowStore((s) => s.nodes);
  const edges = useIVRFlowStore((s) => s.edges);
  const onNodesChange = useIVRFlowStore((s) => s.onNodesChange);
  const onEdgesChange = useIVRFlowStore((s) => s.onEdgesChange);
  const selectNode = useIVRFlowStore((s) => s.selectNode);
  const initFlow = useIVRFlowStore((s) => s.initFlow);
  const undo = useIVRFlowStore((s) => s.undo);
  const redo = useIVRFlowStore((s) => s.redo);
  const layoutFlow = useIVRFlowStore((s) => s.layoutFlow);
  const past = useIVRFlowStore((s) => s.past);
  const future = useIVRFlowStore((s) => s.future);
  const _takeSnapshot = useIVRFlowStore((s) => s._takeSnapshot);

  useEffect(() => {
    initFlow(phoneNumber);
  }, [phoneNumber]);

  const handleNodeClick = useCallback(
    (_event, node) => selectNode(node.id),
    [selectNode],
  );

  /*  Pane click*/
  const handlePaneClick = useCallback(() => selectNode(null), [selectNode]);

  const controlBtnSx = {
    bgcolor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: `${theme.shape.borderRadius * 2}px`,
    boxShadow: theme.shadows[1],
    color: theme.palette.text.primary,
    width: theme.spacing(4),
    height: theme.spacing(4),
    "&:hover": {
      bgcolor: theme.palette.background.default,
      borderColor: theme.palette.primary.main,
    },
    "&.Mui-disabled": { opacity: theme.palette.action.disabledOpacity },
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodeClick={handleNodeClick}
      onPaneClick={handlePaneClick}
      defaultViewport={{ x: 0, y: 0, zoom: 1.0 }}
      minZoom={0.25}
      maxZoom={2}
      nodeDragThreshold={1}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      connectionLineType={ConnectionLineType.SmoothStep}
      connectionRadius={30}
      zoomOnScroll={false}
      panOnScroll
      panOnScrollMode="all"
      proOptions={{ hideAttribution: true }}
      onNodeDragStop={_takeSnapshot}
      style={{ background: theme.palette.background.default }}
    >
      <Background
        variant="dots"
        gap={16}
        size={2}
        color={theme.palette.text.disabled}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 0,
          zIndex: 100,
          pointerEvents: "none",
        }}
      >
        <Box
          sx={{
            mb: 1.5,
            opacity: isMiniMapVisible ? 1 : 0,
            pointerEvents: isMiniMapVisible ? "auto" : "none",
            transition: "opacity 0.3s, transform 0.3s",
            transform: isMiniMapVisible
              ? "translateY(0) scale(1)"
              : "translateY(10px) scale(0.97)",
          }}
        >
          <MiniMap
            pannable
            zoomable
            style={{
              width: 200,
              height: 120,
              borderRadius: "10px",
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: theme.shadows[4],
              backgroundColor: theme.palette.background.paper,
              position: "static",
              margin: 0,
            }}
          />
        </Box>

        <Box
          sx={{
            pointerEvents: "auto",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: theme.spacing(0.75),
            "& .react-flow__controls": {
              position: "static",
              margin: 0,
              display: "flex",
              flexDirection: "row",
              gap: theme.spacing(0.75),
              boxShadow: "none",
              border: "none",
              backgroundColor: "transparent",
            },
            "& .react-flow__controls-button": {
              backgroundColor: `${theme.palette.background.paper} !important`,
              border: `1px solid ${theme.palette.divider} !important`,
              borderRadius: `${theme.shape.borderRadius * 2}px !important`,
              boxShadow: `${theme.shadows[1]} !important`,
              color: `${theme.palette.text.primary} !important`,
              width: `${theme.spacing(4)} !important`,
              height: `${theme.spacing(4)} !important`,
              fill: `${theme.palette.text.primary} !important`,
            },
            "& .react-flow__controls-button svg": {
              fill: `${theme.palette.text.primary} !important`,
              maxWidth: theme.spacing(1.75),
              maxHeight: theme.spacing(1.75),
            },
          }}
        >
          {/* Vertical Order */}
          <Tooltip title="Make Vertical Order" placement="top">
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  layoutFlow("TB");
                  setTimeout(
                    () => fitView({ duration: 800, padding: 0.2 }),
                    50,
                  );
                }}
                disabled={nodes.length <= 1}
                sx={controlBtnSx}
              >
                <AccountTreeOutlinedIcon
                  sx={{ fontSize: "1rem", transform: "rotate(90deg)" }}
                />
              </IconButton>
            </span>
          </Tooltip>
          {/* Undo */}
          <Tooltip title="Undo" placement="top">
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  undo();
                }}
                disabled={past.length === 0}
                sx={controlBtnSx}
              >
                <UndoIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Redo */}
          <Tooltip title="Redo" placement="top">
            <span>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  redo();
                }}
                disabled={future.length === 0}
                sx={controlBtnSx}
              >
                <RedoIcon sx={{ fontSize: "1rem" }} />
              </IconButton>
            </span>
          </Tooltip>

          {/* Zoom controls */}
          <Controls orientation="horizontal" showInteractive={false} />

          {/* MiniMap toggle */}
          <Tooltip
            title={isMiniMapVisible ? "Hide map" : "Show map"}
            placement="top"
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setIsMiniMapVisible((v) => !v);
              }}
              sx={{
                ...controlBtnSx,
                ...(isMiniMapVisible && {
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                }),
              }}
            >
              <MapOutlinedIcon sx={{ fontSize: "1rem" }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </ReactFlow>
  );
}
