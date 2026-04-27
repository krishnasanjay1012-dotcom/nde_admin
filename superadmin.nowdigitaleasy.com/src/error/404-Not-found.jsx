import React from "react";
import { Box, Typography, IconButton } from '@mui/material';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import NotFoundImg from "../assets/image/404-Error.svg"

export default function NotFound() {
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
      <Box sx={{ width: { xs: '60%', sm: '40%', md: '25%' }, mb: 4 }}>
        <img
          src={NotFoundImg}
          alt="404"
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      <Typography
        variant="h2"
        fontWeight={600}
        gutterBottom
        sx={{ color: "rgba(61, 61, 61, 1)" }}
      >
        Page not found
      </Typography>

      <Typography
        variant="h5"
        color="text.secondary"
        sx={{ fontWeight: 400, mb: 4 }}
      >
        Sorry, we couldn’t find the page you’re looking for
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
        <KeyboardBackspaceIcon sx={{ mr: 1, fontSize: { xs: 18, sm: 22 },color:'primary.main' }} />
        Go Back to Home
      </IconButton>
    </Box>
  );
}
