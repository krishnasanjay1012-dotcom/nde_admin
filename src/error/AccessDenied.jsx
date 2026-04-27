import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import AccessDeniedImg from "../assets/image/403-Forbidden.svg"

export default function AccessDeniedPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      textAlign="center"
      px={{ xs: 2, sm: 4, md: 6 }}
      bgcolor="#f9f5ff"
    >
      <Box sx={{ width: { xs: '60%', sm: '40%', md: '28%' }, mb: 1 }}>
        <img
          src={AccessDeniedImg}
          alt="Access Denied"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      <Typography
        variant="h2"
        fontWeight={600}
        gutterBottom
        sx={{ color: "rgba(61, 61, 61, 1)" }}
      >
        Access Denied
      </Typography>

      <Typography
        variant="h5"
        color="text.primary"
        sx={{ fontWeight: 400, mb: 1 }}
      >
        You don’t have permission to view this page.
      </Typography>

      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ fontWeight: 400, mb: 4 }}
      >
        Contact your administrator if this is a mistake.
      </Typography>

      <IconButton
        color="secondary"
        component="a"
        href="/home"
        sx={{
          border: '1px solid',
          borderColor: 'primary.main',
          borderRadius: 2,
          fontSize: { xs: '0.75rem', sm: '0.865rem' },
          fontWeight: 700,
          color: 'primary.main',
          px: 2,
          py: 1,
        }}
      >
        <KeyboardBackspaceIcon sx={{ mr: 1, color:"primary.main",fontSize: { xs: 18, sm: 22 } }} />
        Go Back to Home
      </IconButton>
    </Box>
  );
}
