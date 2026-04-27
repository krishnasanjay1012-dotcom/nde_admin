import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Switch,
  Stack,
  Box,
  Avatar,
  IconButton,
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import CheckIcon from "@mui/icons-material/Check";

const COLORS = [
  { name: "Blue", value: "theme-blue", color: "#1976d2" },
  { name: "Green", value: "theme-green", color: "#2e7d32" },
  { name: "Purple", value: "theme-purple", color: "#7b1fa2" },
  { name: "Orange", value: "theme-orange", color: "#ed6c02" },
];

const UserProfile = () => {
  const [mode, setMode] = useState("light");
  const [themeColor, setThemeColor] = useState("theme-blue");

  /* Load saved theme */
  useEffect(() => {
    const savedMode = sessionStorage.getItem("app-mode") || "light";
    const savedColor = sessionStorage.getItem("app-color") || "theme-blue";

    setMode(savedMode);
    setThemeColor(savedColor);
    document.body.className = `${savedMode} ${savedColor}`;
  }, []);

  /* Apply changes */
  useEffect(() => {
    document.body.className = `${mode} ${themeColor}`;
    sessionStorage.setItem("app-mode", mode);
    sessionStorage.setItem("app-color", themeColor);
  }, [mode, themeColor]);

  return (
    <Card sx={{ maxWidth: 420, borderRadius: 3 }}>
      <CardContent>
        {/* Header */}
        <Stack direction="row" spacing={2} alignItems="center" mb={3}>
          <Avatar sx={{ bgcolor: "primary.main" }}>U</Avatar>
          <Box>
            <Typography variant="h6">User Profile</Typography>
            <Typography variant="body2" color="text.secondary">
              Appearance Settings
            </Typography>
          </Box>
        </Stack>

        {/* Dark / Light Toggle */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={3}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <LightModeIcon fontSize="small" />
            <Typography>Theme Mode</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Switch
              checked={mode === "dark"}
              onChange={() =>
                setMode((prev) => (prev === "light" ? "dark" : "light"))
              }
            />
            <DarkModeIcon fontSize="small" />
          </Stack>
        </Stack>

        <Typography variant="body2" mb={2}>
          <strong>Current:</strong> {mode.toUpperCase()}
        </Typography>

        {/* Color Picker */}
        <Typography variant="subtitle1" mb={1}>
          Theme Color
        </Typography>

        <Stack direction="row" spacing={2}>
          {COLORS.map((c) => (
            <IconButton
              key={c.value}
              onClick={() => setThemeColor(c.value)}
              sx={{
                width: 40,
                height: 40,
                bgcolor: c.color,
                border:
                  themeColor === c.value
                    ? "3px solid"
                    : "2px solid transparent",
                borderColor: themeColor === c.value ? "primary.main" : "transparent",
                "&:hover": {
                  bgcolor: c.color,
                  opacity: 0.9,
                },
              }}
            >
              {themeColor === c.value && (
                <CheckIcon sx={{ color: "#fff" }} fontSize="small" />
              )}
            </IconButton>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
