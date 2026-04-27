import { Box, useTheme } from "@mui/material";
import { alpha } from "@mui/material/styles";
import GridViewIcon from "@mui/icons-material/GridView";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import VolumeUpOutlinedIcon from "@mui/icons-material/VolumeUpOutlined";
import CallEndOutlinedIcon from "@mui/icons-material/CallEndOutlined";
import { IVR_NODE_TYPES } from "../../../catalog";

// maps each node
function useIconConfig(type, theme) {
  switch (type) {
    case IVR_NODE_TYPES.IVR_MENU:
      return { icon: GridViewIcon, color: theme.palette.info.main };
    case IVR_NODE_TYPES.CONNECT_USER:
      return {
        icon: PersonOutlineIcon,
        color: theme.palette.secondary?.main || theme.palette.primary.main,
      };
    case IVR_NODE_TYPES.CONNECT_TEAM:
      return {
        icon: GroupsOutlinedIcon,
        color: theme.palette.secondary?.main || theme.palette.primary.main,
      };
    case IVR_NODE_TYPES.PLAY_AUDIO:
      return { icon: VolumeUpOutlinedIcon, color: theme.palette.warning.main };
    case IVR_NODE_TYPES.HANGUP:
      return { icon: CallEndOutlinedIcon, color: theme.palette.error.main };
    default:
      return null;
  }
}

// renders the icon
export default function ActionIcon({ type, size = "1.2rem", withBg = false }) {
  const theme = useTheme();
  const config = useIconConfig(type, theme);
  if (!config) return null;

  const IconComp = config.icon;

  if (withBg) {
    return (
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: alpha(config.color, 0.1),
        }}
      >
        <IconComp sx={{ fontSize: size, color: config.color }} />
      </Box>
    );
  }

  return <IconComp sx={{ fontSize: size, color: config.color }} />;
}
