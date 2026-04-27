import { Box, useTheme } from "@mui/material";

export default function WaveLoader({
  size = 48,
  barCount = 6,
  duration = 1.4,
}) {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        height: size,
        gap: `${size / 12}px`,
        perspective: "600px",
      }}
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <Box
          key={i}
          sx={{
            width: size / (barCount + 1.5),
            height: size * 0.55,
            borderRadius: "8px",
            background: `linear-gradient(180deg, ${color} 0%, ${theme.palette.primary.light} 100%)`,
            animation: `waveUpDown ${duration}s ease-in-out infinite`,
            animationDelay: `${i * 0.12}s`,
            transformOrigin: "center bottom",
            "@keyframes waveUpDown": {
              "0%, 100%": {
                transform: "scaleY(0.5) rotateX(0deg)",
                opacity: 0.7,
              },
              "40%": {
                transform: "scaleY(1.3) rotateX(5deg)",
                opacity: 1,
              },
              "60%": {
                transform: "scaleY(0.8) rotateX(0deg)",
                opacity: 0.85,
              },
            },
          }}
        />
      ))}
    </Box>
  );
}
