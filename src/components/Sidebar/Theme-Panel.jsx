import {
  Paper,
  Typography,
  Box,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsBrightnessIcon from "@mui/icons-material/SettingsBrightness";
import CheckIcon from "@mui/icons-material/Check";
import { useAppTheme } from "../../context/useAppTheme";
import { useUpdateViewPreference } from "../../hooks/auth/login";

const themeColors = [
  "#2330E7", "#0F766E", "#16A34A", "#84A30D", "#C28C00",
  "#D4571B", "#8B5CF6", "#9C27B0", "#FF6B8B", "#3B5BA9",
  "#0E7490", "#5A4634",
];

const ThemePanel = () => {

  const { mode, setMode, primaryColor, setPrimaryColor } = useAppTheme();
  const { mutate: updatePreference } = useUpdateViewPreference();

  const handleModeChange = (event, value) => {
    if (!value) return;

    setMode(value);

    const apiModeMap = {
      day: "light",
      night: "dark",
      auto: "auto",
    };

    updatePreference({
      mode: apiModeMap[value],
    });
  };

  const handleColorChange = (color) => {
    setPrimaryColor(color);

    updatePreference({
      themeColor: color,
    });
  };

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: "background.muted" }}>
      <Stack spacing={2}>
        {/* MODE */}
        <Box>
          <Typography variant="body1" mb={1}>Mode</Typography>

          <ToggleButtonGroup
            value={mode}
            exclusive
            onChange={handleModeChange}
            sx={{
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: "25px",
              p: 0.5,
              gap: 1,
              backgroundColor: "background.paper",
            }}
          >
            {[
              { value: "day", label: "Day", icon: <LightModeIcon /> },
              { value: "night", label: "Night", icon: <DarkModeIcon /> },
              { value: "auto", label: "Auto", icon: <SettingsBrightnessIcon /> },
            ].map((item) => (
              <ToggleButton
                key={item.value}
                value={item.value}
                sx={{
                  textTransform: "none",
                  borderRadius: "50px",
                  px: 2,
                  py: 0.5,
                  border: "none",
                  display: "flex",
                  gap: 1,
                  color: "text.primary",
                  "&:hover": {
                    borderRadius: "50px",
                    backgroundColor: "action.hover",
                  },
                  "&.Mui-selected": {
                    backgroundColor: primaryColor,
                    color: "#fff",
                    borderRadius: "50px",
                  },
                  "&.Mui-selected:hover": {
                    backgroundColor: primaryColor,
                  },
                  "&.Mui-selected .MuiSvgIcon-root": {
                    color: "icon.light",
                  },
                }}
              >
                {item.icon}
                {item.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {/* THEME COLORS */}
        <Box>
          <Typography variant="body1" mb={1}>Themes</Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {themeColors.map((color) => (
              <Box
                key={color}
                onClick={() => handleColorChange(color)}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: color,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border:
                    primaryColor === color
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  boxShadow:
                    primaryColor === color
                      ? `0 0 0 2px ${color}`
                      : "none",
                }}
              >
                {primaryColor === color && (
                  <CheckIcon sx={{ color: "#fff", fontSize: 12 }} />
                )}
              </Box>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

export default ThemePanel;