import { Box, Typography } from "@mui/material";

export default function OutgoingCallsTab() {
  return (
    <Box sx={{ maxWidth: 520, pt: 1 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Outgoing calls
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary" }}>
        Outgoing call settings will be configured here.
      </Typography>
    </Box>
  );
}
