import React from "react";
import { Box, LinearProgress } from "@mui/material";

const CommonPreloader = ({
  loading = false,
  height = 4,
  color = "primary",
  position = "top",
}) => {
  if (!loading) return null;

  return (
    <Box
      sx={{
        position: position === "center" ? "absolute" : "sticky",
        top: position === "top" ? 0 : "auto",
        bottom: position === "bottom" ? 0 : "auto",
        left: 0,
        right: 0,
        zIndex: 1300,
        width: "100%",
      }}
    >
      <LinearProgress
        color={color}
        sx={{
          height,
          borderRadius: height,
        }}
      />
    </Box>
  );
};

export default CommonPreloader;
