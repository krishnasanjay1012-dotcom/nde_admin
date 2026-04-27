import {
  ArrowForwardIosRounded,
  PieChartRounded,
  SpeedRounded,
  TrackChangesRounded,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const options = [
  {
    label: "Charts",
    value: "chart",
    icon: <PieChartRounded />,
    description: "Visual data representation",
  },
  {
    label: "KPI",
    value: "kpi",
    icon: <SpeedRounded />,
    description: "Key performance indicators",
  },
  {
    label: "Target Meter",
    value: "target",
    icon: <TrackChangesRounded />,
    description: "Goal tracking indicators",
  },
];
export default function ComponentTypeList({ componentType, setComponentType }) {
  const theme = useTheme();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="overline"
        sx={{
          // px: 2,
          color: theme.palette.text.disabled,
          fontWeight: 600,
          letterSpacing: "1px",
        }}
      >
        Available Widgets
      </Typography>

      <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {options.map((option) => {
          const isActive = componentType === option.value;

          return (
            <ListItem key={option.value} disablePadding>
              <ListItemButton
                onClick={() => setComponentType(option.value)}
                sx={{
                  borderRadius: 2,
                  p: 1.5,
                  border: "1px solid",
                  borderColor: isActive
                    ? theme.palette.primary.main
                    : "transparent",
                  bgcolor: isActive
                    ? alpha(theme.palette.primary.main, 0.04)
                    : "transparent",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: isActive
                      ? alpha(theme.palette.primary.main, 0.08)
                      : alpha(theme.palette.action.hover, 0.08),
                    transform: "translateY(-1px)",
                    boxShadow: `0 4px 12px ${alpha(theme.palette.text.primary, 0.03)}`,
                  },
                }}
              >
                <Box
                  sx={{
                    p: 1.2,
                    mr: 2,
                    borderRadius: 2,
                    bgcolor: isActive
                      ? theme.palette.primary.main
                      : alpha(theme.palette.action.selected, 0.1),
                    color: isActive
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                    display: "flex",
                    transition: "all 0.2s",
                  }}
                >
                  {option.icon}
                </Box>
                <ListItemText
                  primary={option.label}
                  secondary={option.description}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 500,
                    color: isActive
                      ? theme.palette.primary.main
                      : theme.palette.text.primary,
                  }}
                  secondaryTypographyProps={{
                    variant: "caption",
                    color: theme.palette.text.secondary,
                  }}
                />
                <ArrowForwardIosRounded
                  sx={{
                    fontSize: 14,
                    color: isActive ? theme.palette.primary.main : "",
                    transform: isActive ? "translateX(2px)" : "none",
                    transition: "all 0.2s",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
