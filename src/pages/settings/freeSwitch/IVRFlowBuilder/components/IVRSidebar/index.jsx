import { useMemo } from "react";
import { Box, CircularProgress, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useIVRFlowStore } from "../../store/ivrFlowStore";
import { IVR_NODE_TYPES } from "../../catalog";
import TriggerInspector from "./inspectors/TriggerInspector";
import IVRMenuInspector from "./inspectors/IVRMenuInspector";
import ActionNodeInspector from "./inspectors/ActionNodeInspector";
import EmptyState from "./EmptyState";

const SIDEBAR_W = 320;

// main sidebar shell — resolves which inspector to show based on selected node
export default function IVRSidebar() {
  const theme = useTheme();
  const selectedNodeId = useIVRFlowStore((s) => s.selectedNodeId);
  const nodes = useIVRFlowStore((s) => s.nodes);
  const isLoading = useIVRFlowStore((s) => s.isLoading);

  const selectedNode = useMemo(
    () => (selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null),
    [selectedNodeId, nodes],
  );

  const renderContent = () => {
    if (!selectedNode) return <EmptyState />;

    switch (selectedNode.type) {
      case IVR_NODE_TYPES.TRIGGER:
        return (
          <TriggerInspector nodeId={selectedNode.id} data={selectedNode.data} />
        );
      case IVR_NODE_TYPES.IVR_MENU:
        return (
          <IVRMenuInspector nodeId={selectedNode.id} data={selectedNode.data} />
        );
      default:
        return (
          <ActionNodeInspector
            nodeId={selectedNode.id}
            data={selectedNode.data}
          />
        );
    }
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_W,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderLeft: `1px solid ${theme.palette.divider}`,
        bgcolor: theme.palette.background.paper,
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* loading overlay */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: alpha(theme.palette.background.paper, 0.7),
            zIndex: 10,
          }}
        >
          <CircularProgress size={32} />
        </Box>
      )}
      {renderContent()}
    </Box>
  );
}
