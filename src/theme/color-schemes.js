import { components } from "./mui-components";

export const lightPalette = {
  mode: "light",
  primary: {
    main: "#2330E7",
    light: "#4752EB",
    dark: "#1E28B5",
    extraLight: "#F1F2FD",
    border: "#DADCFB",
    contrastText: "#FFFFFF",
  },
  blue: {
    50: "#F1F2FD",
    100: "#DADCFB",
    200: "#B6BAF7",
    300: "#9198F3",
    400: "#6C75EF",
    500: "#4752EB",
  },
  success: {
    main: "#27AE60",
    light: "#E5F5EC",
    dark: "#1C7F46",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#EB5757",
    light: "#FFEBEE",
    dark: "#C62828",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#E2B93B",
    light: "#FFF6DA",
    dark: "#B28704",
    contrastText: "#000000",
  },
  info: {
    main: "#2F80ED",
    light: "#E8F1FD",
    dark: "#1E5CC6",
    contrastText: "#FFFFFF",
  },
  text: {
    primary: "#000000",
    secondary: "#353759",
    black3: "#282828",
    white: "#FFFFFF",
  },
  grey: {
    1: "#333333",
    2: "#4F4F4F",
    3: "#6c718a",
    4: "#BDBDBD",
    5: "#E0E0E0",
    6: "#64748B",
  },
  background: {
    default: "#F1F2FD",
    paper: "#FFFFFF",
    muted: "#F9F9FB",
    hover: "#EDEDFC",
  },
  divider: "#EBEBEF",
  icon: {
    main: "#64748B",
    light: "#FFFFFF",
  },
};

export const darkPalette = {
  mode: "dark",
  primary: {
    main: "#2330E7",
    light: "#4752EB",
    dark: "#1E28B5",
    extraLight: "#1A1B2E",
    border: "#2D2E4D",
    contrastText: "#FFFFFF",
  },
  blue: {
    50: "#1A1B2E",
    100: "#2D2E4D",
    200: "#41437A",
    300: "#5558A7",
    400: "#696DD4",
    500: "#7D82FF",
  },
  success: {
    main: "#2ECC71",
    light: "#1D3C29",
    dark: "#145D32",
    contrastText: "#FFFFFF",
  },
  error: {
    main: "#E74C3C",
    light: "#3C1D1D",
    dark: "#922B21",
    contrastText: "#FFFFFF",
  },
  warning: {
    main: "#F1C40F",
    light: "#3C3A1D",
    dark: "#9A7D0A",
    contrastText: "#000000",
  },
  info: {
    main: "#3498DB",
    light: "#1D2D3C",
    dark: "#1F618D",
    contrastText: "#FFFFFF",
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#AEB0D1",
    black3: "#E0E0E0",
    white: "#FFFFFF",
  },
  grey: {
    1: "#F2F2F2",
    2: "#E0E0E0",
    3: "#AEB0D1",
    4: "#757575",
    5: "#424242",
    6: "#FFFFFFB2",
  },
  background: {
    default: "#0F172A",
    paper: "#162032",
    muted: "#1A1B2E",
    hover: "#1F213A",
  },
  divider: "#2D2E4D",
  icon: {
    main: "#AEB0D1",
    light: "#FFFFFF",
  },
};

export const colorSchemes = {
  light: {
    palette: lightPalette,
    components,
  },
  dark: {
    palette: darkPalette,
    components,
  },
};
