import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  alpha,
  Tooltip,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useIVRFlowStore } from "../../store/ivrFlowStore";
import CommonButton from "../../../../../../components/common/NDE-Button";

export default function IVRNavbar({ flowName, onSave }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();

  const openMessage = useIVRFlowStore((s) => s.openMessage);

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      openMessage("IVR flow saved.", "success");
    }
  };

  const handleBack = () => {
    // Navigate back to the virtual number incoming calls tab
    if (id) {
      navigate(`/settings/freeSwitch/virtual-number/${id}/incoming-calls`);
    } else {
      navigate("/settings/freeSwitch/virtual-number");
    }
  };

  return (
    <Box
      sx={{
        height: 52,
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        flexShrink: 0,
      }}
    >
      {/* ── Left: back + title ── */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {/* Back link */}
        <Box
          onClick={handleBack}
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 0.25,
            cursor: "pointer",
            color: "primary.main",
            "&:hover": { textDecoration: "underline" },
          }}
        >
          <ChevronLeftIcon sx={{ fontSize: "0.9rem", color: "primary.main" }} />
          <Typography
            variant="body1"
            sx={{ fontSize: "12px", color: "primary.main", fontWeight: 500 }}
          >
            Back to Virtual Numbers
          </Typography>
        </Box>

        {/* Flow name */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            {flowName || "IVR Flow"}
          </Typography>
          <Tooltip title="Flow settings info">
            <InfoOutlinedIcon
              sx={{
                fontSize: "0.95rem",
                color: theme.palette.text.disabled,
                cursor: "help",
              }}
            />
          </Tooltip>
        </Box>
      </Box>

      {/* ── Right: Settings + Publish ── */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CommonButton
          label="Settings"
          variant="outlined"
          startIcon={false}
          onClick={() => {}}
          sx={{ minWidth: 90 }}
        />
        <CommonButton
          label="Publish"
          startIcon={
            <PublishOutlinedIcon
              sx={{ fontSize: "1rem", color: "icon.light" }}
            />
          }
          onClick={handleSave}
        />
      </Box>
    </Box>
  );
}
