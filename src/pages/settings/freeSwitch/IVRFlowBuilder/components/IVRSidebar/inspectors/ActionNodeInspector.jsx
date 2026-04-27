import { useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  Divider,
  IconButton,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { IVR_NODE_TYPES, DEMO_USERS, DEMO_TEAMS } from "../../../catalog";
import { useIVRFlowStore } from "../../../store/ivrFlowStore";
import SearchablePicker from "../shared/SearchablePicker";

export default function ActionNodeInspector({ nodeId, data }) {
  const theme = useTheme();
  const selectNode = useIVRFlowStore((s) => s.selectNode);
  const setComponentName = useIVRFlowStore((s) => s.setComponentName);
  const edges = useIVRFlowStore((s) => s.edges);
  const setKeypressTarget = useIVRFlowStore((s) => s.setKeypressTarget);

  const isUser = data.type === IVR_NODE_TYPES.CONNECT_USER;
  const isTeam = data.type === IVR_NODE_TYPES.CONNECT_TEAM;
  const subOptions = isUser ? DEMO_USERS : isTeam ? DEMO_TEAMS : [];

  // find the parent keypress that spawned this node
  const parentEdge = edges.find((e) => e.target === nodeId);
  const parentNodeId = parentEdge?.source;
  const parentKey = parseInt(
    parentEdge?.sourceHandle?.replace("key-", "") || "0",
  );

  const handleTargetChange = useCallback(
    (id, name) => {
      if (parentNodeId && parentKey) {
        setKeypressTarget(parentNodeId, parentKey, id, name);
      }
    },
    [parentNodeId, parentKey, setKeypressTarget],
  );

  return (
    <Box>
      {/* header */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {data.name || "Action"}
        </Typography>
        <IconButton size="small" onClick={() => selectNode(null)}>
          <CloseIcon sx={{ fontSize: "1rem" }} />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 500, mb: 0.75 }}>
          Component name
        </Typography>
        <TextField
          size="small"
          fullWidth
          value={data.name || ""}
          onChange={(e) => setComponentName(nodeId, e.target.value)}
          sx={{ mb: 2.5 }}
        />

        {/* user or team picker */}
        {(isUser || isTeam) && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              {isUser ? "Select user" : "Select team"}
            </Typography>
            <SearchablePicker
              options={subOptions}
              value={data.targetId || ""}
              onChange={handleTargetChange}
              placeholder={isUser ? "Search users..." : "Search teams..."}
            />
          </>
        )}

        {/* hangup info */}
        {data.type === IVR_NODE_TYPES.HANGUP && (
          <>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
              The call will be terminated at this point.
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}
