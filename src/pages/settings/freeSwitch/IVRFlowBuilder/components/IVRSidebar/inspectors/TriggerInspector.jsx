import {
  Box,
  Typography,
  TextField,
  Divider,
  FormControl,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { IVR_NODE_TYPES } from "../../../catalog";
import { useIVRFlowStore } from "../../../store/ivrFlowStore";
import ActionIcon from "../shared/ActionIcon";

const TRIGGER_ACTIONS = [
  { value: IVR_NODE_TYPES.PLAY_AUDIO, label: "Play Audio" },
  { value: IVR_NODE_TYPES.IVR_MENU, label: "IVR Menu" },
];

// inspector panel
export default function TriggerInspector({ nodeId, data }) {
  const setComponentName = useIVRFlowStore((s) => s.setComponentName);
  const setTriggerAction = useIVRFlowStore((s) => s.setTriggerAction);
  const edges = useIVRFlowStore((s) => s.edges);
  const nodes = useIVRFlowStore((s) => s.nodes);

  const childEdge = edges.find((e) => e.source === nodeId);
  const childNode = childEdge
    ? nodes.find((n) => n.id === childEdge.target)
    : null;
  const currentAction = childNode?.type || "";

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Trigger component
      </Typography>

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

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
        Then
      </Typography>
      <FormControl size="small" fullWidth>
        <Select
          value={currentAction}
          displayEmpty
          onChange={(e) => setTriggerAction(nodeId, e.target.value)}
          renderValue={(v) =>
            v ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ActionIcon type={v} />
                <Typography variant="body1">
                  {TRIGGER_ACTIONS.find((a) => a.value === v)?.label || v}
                </Typography>
              </Box>
            ) : (
              <Typography variant="body1" sx={{ color: "text.secondary" }}>
                Select
              </Typography>
            )
          }
        >
          {TRIGGER_ACTIONS.map((a) => (
            <MenuItem key={a.value} value={a.value}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ActionIcon type={a.value} />
                <Typography variant="body1">{a.label}</Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
