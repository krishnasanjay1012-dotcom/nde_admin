import React from "react";
import { Box, Typography, Button } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const Error500 = () => {

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #ff6f91 0%, #ff9671 100%)",
        color: "#fff",
        textAlign: "center",
        px: 2,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Floating circles animation */}
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: 0,
          "&::before, &::after": {
            content: '""',
            position: "absolute",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            animation: "float 6s ease-in-out infinite",
          },
          "&::before": { width: 200, height: 200, top: "10%", left: "15%" },
          "&::after": { width: 300, height: 300, bottom: "5%", right: "10%" },
        }}
      />
      <ErrorOutlineIcon sx={{ fontSize: 100, mb: 2, zIndex: 1 }} />
      <Typography variant="h1" sx={{ zIndex: 1 }}>
        500
      </Typography>
      <Typography variant="h4" sx={{ mb: 2, zIndex: 1 }}>
        Oops! Something went wrong
      </Typography>
      <Typography sx={{ maxWidth: 500, mb: 4, zIndex: 1 }}>
        Our server is having a little trouble. Please try refreshing or come back later.
      </Typography>
       <Button
        variant="contained"
        onClick={handleReload}
        sx={{
          px: 6,
          py: 1.8,
          fontWeight: 700,
          borderRadius: 4,
          zIndex: 1,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.6))",
          color: "#ff3d57",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          textTransform: "uppercase",
          letterSpacing: 1,
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "scale(1.1) rotate(-2deg)",
            boxShadow: "0 12px 25px rgba(0,0,0,0.4)",
          },
        }}
      >
        Reload
      </Button>

      {/* Keyframes for floating animation */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px) }
            50% { transform: translateY(-20px) }
            100% { transform: translateY(0px) }
          }
        `}
      </style>
    </Box>
  );
};

export default Error500;
