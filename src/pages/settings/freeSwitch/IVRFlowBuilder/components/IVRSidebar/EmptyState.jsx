import { Box, Typography, useTheme } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

// shown in the sidebar when no node is selected
export default function EmptyState() {
  const theme = useTheme();
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
        gap: 1,
      }}
    >
      <PlayCircleOutlineIcon
        sx={{ fontSize: "2.5rem", color: theme.palette.text.disabled }}
      />
      <Typography
        variant="body1"
        sx={{ color: "text.secondary", textAlign: "center" }}
      >
        Click a node to configure it
      </Typography>
    </Box>
  );
}
