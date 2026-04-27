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
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { IVR_NODE_TYPES } from "../catalog";
import { useIVRFlowStore } from "../store/ivrFlowStore";

/**
 * IVR Action Node — used for Connect to User, Connect to Team, Play Audio, Hangup
 */
const IVRActionNode = memo(({ id, data, selected }) => {
  const theme = useTheme();
  const deleteNode = useIVRFlowStore((s) => s.deleteNode);

  const getMeta = (type) => {
    switch (type) {
      case IVR_NODE_TYPES.CONNECT_USER:
        return {
          label: "Connect to User",
          color: theme.palette.secondary?.main || theme.palette.primary.main,
          Icon: PersonOutlineIcon,
        };
      case IVR_NODE_TYPES.CONNECT_TEAM:
        return {
          label: "Connect to Team",
          color: theme.palette.secondary?.main || theme.palette.primary.main,
          Icon: GroupsOutlinedIcon,
        };
      case IVR_NODE_TYPES.PLAY_AUDIO:
        return {
          label: "Play Audio",
          color: theme.palette.warning.main,
          Icon: VolumeUpOutlinedIcon,
        };
      case IVR_NODE_TYPES.HANGUP:
        return {
          label: "Hangup",
          color: theme.palette.error.main,
          Icon: CallEndOutlinedIcon,
        };
      default:
        return {
          label: "Action",
          color: theme.palette.primary.main,
          Icon: PersonOutlineIcon,
        };
    }
  };

  const { label, color, Icon } = getMeta(data.type);

  const handleDelete = useCallback(
    (e) => {
      e.stopPropagation();
      deleteNode(id);
    },
    [id, deleteNode],
  );

  // Compute display number from node name (e.g. "Connect to team - 1")
  const displayName = data.name || label;

  return (
    <Box
      sx={{
        width: 230,
        bgcolor: theme.palette.background.paper,
        borderRadius: "10px",
        border: `2px solid ${selected ? color : alpha(color, 0.4)}`,
        boxShadow: selected
          ? `0 0 0 3px ${alpha(color, 0.18)}`
          : theme.shadows[2],
        overflow: "hidden",
        transition: "border-color 0.18s, box-shadow 0.18s",
      }}
    >
      {/* Input handle — top center */}
      <Handle
        type="target"
        position={Position.Top}
        id="in"
        style={{
          background: color,
          width: theme.spacing(1.5),
          height: theme.spacing(1.5),
          border: `2px solid ${theme.palette.common.white}`,
        }}
      />

      {/* Colour top stripe */}
      <Box sx={{ height: theme.spacing(0.625), bgcolor: color }} />

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
        <Icon sx={{ fontSize: "1.1rem", color, flexShrink: 0 }} />
        <Typography
          variant="body1"
          sx={{ fontWeight: 600, flex: 1, color: theme.palette.text.primary }}
          noWrap
        >
          {displayName}
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

      {/* Body */}
      <Box sx={{ px: 1.5, py: 1 }}>
        {data.targetName ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Typography
              variant="body1"
              sx={{ color: theme.palette.text.secondary }}
            >
              Connect to
            </Typography>
            <ArrowForwardIcon
              sx={{ fontSize: "0.8rem", color: theme.palette.text.disabled }}
            />
            <Typography
              variant="body1"
              sx={{ fontWeight: 500, color: theme.palette.text.primary }}
              noWrap
            >
              {data.targetName}
            </Typography>
          </Box>
        ) : data.type === IVR_NODE_TYPES.HANGUP ? (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.error.main, fontWeight: 500 }}
          >
            Call ends here
          </Typography>
        ) : data.type === IVR_NODE_TYPES.PLAY_AUDIO ? (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.secondary }}
          >
            {data.audioFile ? data.audioFile.name : "No audio uploaded"}
          </Typography>
        ) : (
          <Typography
            variant="body1"
            sx={{ color: theme.palette.text.disabled }}
          >
            Not configured
          </Typography>
        )}
      </Box>
    </Box>
  );
});

export default IVRActionNode;
