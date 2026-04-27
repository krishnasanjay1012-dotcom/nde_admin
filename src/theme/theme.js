import { createTheme } from "@mui/material/styles";
import { shadows } from './shadows';
import { typography } from './typography';
import { colorSchemes } from './color-schemes';

const commonTheme = createTheme({
  palette: colorSchemes.light.palette,
  components: colorSchemes.light.components,
  typography,
  shadows,
  shape: { borderRadius: 4 },
  breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } },
});

export default commonTheme;
