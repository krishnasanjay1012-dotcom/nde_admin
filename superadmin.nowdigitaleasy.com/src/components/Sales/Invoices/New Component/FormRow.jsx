import { Box, FormLabel, Typography, useMediaQuery, useTheme } from "@mui/material";

export default function FormRow({
  label,
  mandatory,
  children,
  flex = "unset",
  minWidth = 140,
  flexDirection = "row",
  sx,
  gap = 2,
  alignItems = "center",
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <Box
      display="flex"
      gap={gap}
      alignItems={alignItems}
      flex={flex}
      width={{ xs: "100%", sm: "fit-content" }}
      flexDirection={flexDirection}
      sx={{ ...sx }}
    >
      <Box minWidth={isMobile ? "100%" : minWidth}>
        {/* <FormLabel sx={{ color: mandatory ? "red" : "" }}>
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </FormLabel> */}

        <Typography
          variant="body2"
          sx={{
            fontWeight: 400,
            color: mandatory ? "error.main" : "text.primary",
            fontSize: "14px",
          }}
        >
          {label}
          {mandatory && <span style={{ color: "red" }}> *</span>}
        </Typography>
      </Box>
      <Box width={isMobile ? "100%" : "auto"}>{children}</Box>
    </Box>
  );
}
