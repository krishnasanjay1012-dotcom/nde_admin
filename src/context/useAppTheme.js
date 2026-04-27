import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used within AppThemeProvider");
  return context;
};