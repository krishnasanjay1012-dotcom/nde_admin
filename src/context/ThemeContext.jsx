import React, { createContext, useMemo, useState, useEffect } from "react";
import { ThemeProvider, createTheme, alpha, lighten, darken } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { colorSchemes } from "../theme/color-schemes";
import { typography } from "../theme/typography";
import { shadows } from "../theme/shadows";

import { useAdminId } from "../utils/session";
import { useAdminDetailsById } from "../hooks/auth/login";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export const AppThemeProvider = ({ children }) => {
  const adminId = useAdminId();

  const { data } = useAdminDetailsById({
    id: adminId,
    open: true,
  });

  const profile = data?.data;

  const [mode, setMode] = useState("day");
  const [primaryColor, setPrimaryColor] = useState(
    colorSchemes.light.palette.primary.main
  );
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      setPrefersDark(mq.matches);

      const listener = (e) => setPrefersDark(e.matches);
      mq.addEventListener("change", listener);

      return () => mq.removeEventListener("change", listener);
    }
  }, []);

  useEffect(() => {
    if (!profile) return;

    const modeMap = {
      light: "day",
      dark: "night",
      auto: "auto",
    };

    if (profile.mode) {
      setMode(modeMap[profile.mode] || "day");
    }

    if (profile.themeColor) {
      setPrimaryColor(profile.themeColor);
    }
  }, [profile]);

  const appliedMode =
    mode === "auto"
      ? prefersDark
        ? "dark"
        : "light"
      : mode === "night"
        ? "dark"
        : "light";

  const theme = useMemo(() => {
    const selectedPalette =
      appliedMode === "dark"
        ? colorSchemes.dark.palette
        : colorSchemes.light.palette;

    return createTheme({
      palette: {
        ...selectedPalette,
        primary: {
          main: primaryColor,
          light: lighten(primaryColor, 0.2),
          dark: darken(primaryColor, 0.2),
          extraLight: alpha(primaryColor, 0.1),
          border: alpha(primaryColor, 0.2),
          contrastText: "#FFFFFF",
        },
        background: {
          ...selectedPalette.background,
          default:
            appliedMode === "dark"
              ? selectedPalette.background.default
              : alpha(primaryColor, 0.1),
        },
      },
      typography,
      shadows,
      components: colorSchemes[appliedMode].components,
    });
  }, [appliedMode, primaryColor]);

  return (
    <ThemeContext.Provider value={{ mode, setMode, primaryColor, setPrimaryColor }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};