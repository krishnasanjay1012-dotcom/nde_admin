import { useParams, useLocation } from "react-router-dom";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Box, useTheme } from "@mui/material";

import IVRCanvas from "./components/IVRCanvas";
import IVRSidebar from "./components/IVRSidebar";
import IVRNavbar from "./components/IVRNavbar";

function IVRFlowBuilderInner() {
  const theme = useTheme();
  const { flowId } = useParams();
  const location = useLocation();

  // phone number
  const phoneNumber = location.state?.phoneNumber || "";

  // human readable
  const flowName =
    flowId === "new"
      ? "New IVR Flow"
      : flowId
        ? `IVR Flow - ${flowId}`
        : "IVR Flow";

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: theme.palette.background.default,
      }}
    >
      <IVRNavbar flowName={flowName} />

      <Box sx={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>
        <Box sx={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <IVRCanvas phoneNumber={phoneNumber} />
        </Box>
        <IVRSidebar />
      </Box>
    </Box>
  );
}

export default function IVRFlowBuilder() {
  return (
    <ReactFlowProvider>
      <IVRFlowBuilderInner />
    </ReactFlowProvider>
  );
}
