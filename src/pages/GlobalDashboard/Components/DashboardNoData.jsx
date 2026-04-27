import { Box, Typography, useTheme } from "@mui/material";

export default function NoDataDashboard({
  size = 150,
  text = "No data available to display",
}) {
  const theme = useTheme();
  const color1 = theme.palette.primary.main || "#3aaa8f";
  const color2 = theme.palette.primary.light || "#6dcbb5";
  const color3 = theme.palette.primary.dark || "#1d7a65";

  const isDark = theme.palette.mode === "dark";

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap="8px">
      <svg
        width={size}
        height={size}
        viewBox="0 0 180 180"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        style={{ display: "block" }}
      >
        {/* Soft background circle */}
        <circle cx="90" cy="90" r="72" fill={color1} opacity="0.08" />
        <circle cx="90" cy="90" r="56" fill={color1} opacity="0.06" />

        {/* Chart area background — simple rounded rect */}
        <rect
          x="28"
          y="44"
          width="124"
          height="92"
          rx="10"
          fill={
            isDark
              ? theme.palette.background.default
              : theme.palette.background.paper
          }
        />
        <rect
          x="28"
          y="44"
          width="124"
          height="92"
          rx="10"
          fill="none"
          stroke={color1}
          strokeWidth="1"
          opacity="0.15"
        />

        {/* X axis line */}
        <line
          x1="40"
          y1="122"
          x2="140"
          y2="122"
          stroke={color1}
          strokeWidth="1"
          opacity="0.2"
        />

        {/* Y axis line */}
        <line
          x1="40"
          y1="54"
          x2="40"
          y2="122"
          stroke={color1}
          strokeWidth="1"
          opacity="0.2"
        />

        {/* 5 clean bars from left to right, bottom-aligned at y=122 */}
        {/* heights: 28, 48, 36, 60, 42 */}
        <rect
          x="50"
          y="94"
          width="16"
          height="28"
          rx="4"
          fill={color2}
          opacity="0.6"
        />
        <rect
          x="72"
          y="74"
          width="16"
          height="48"
          rx="4"
          fill={color1}
          opacity="0.85"
        />
        <rect
          x="94"
          y="86"
          width="16"
          height="36"
          rx="4"
          fill={color2}
          opacity="0.7"
        />
        <rect
          x="116"
          y="62"
          width="16"
          height="60"
          rx="4"
          fill={color3}
          opacity="0.9"
        />

        {/* Small trend dots on top of bars */}
        <circle cx="58" cy="91" r="2.5" fill={color3} />
        <circle cx="80" cy="71" r="2.5" fill={color3} />
        <circle cx="102" cy="83" r="2.5" fill={color3} />
        <circle cx="124" cy="59" r="2.5" fill={color3} />

        {/* Trend line connecting dots */}
        <polyline
          points="58,91 80,71 102,83 124,59"
          fill="none"
          stroke={color3}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3 2"
          opacity="0.5"
        />

        {/* Small upward arrow top-right of chart */}
        <polyline
          points="128,52 132,47 136,49 140,43"
          fill="none"
          stroke="#4ade80"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polygon points="138,42 142,41 141,45" fill="#4ade80" />
      </svg>

      <Typography
        sx={{ fontSize: "13px", fontWeight: 600, mt: -1 }}
        color="text.secondary"
      >
        {text}
      </Typography>
    </Box>
  );
}
