import React from "react";
import { Typography, Stack, Paper, Divider, Box } from "@mui/material";

const InfoRow = ({ label, value }) => (
  <Stack direction="row" spacing={2}>
    <Typography color="text.secondary" sx={{ minWidth: 160 }}>
      {label}
    </Typography>
    <Typography fontWeight={500}>{value}</Typography>
  </Stack>
);

const ContactDetailsCard = ({ currencyCode, portal = false, customerType,paymentTermName }) => {
  return (
    <Paper variant="outlined" sx={{ mb: 2, borderRadius: "12px" }}>
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 600 }}>Contact Details</Typography>
        </Box>
      </Box>
      <Divider />
      <Stack spacing={1.5} p={2}>
        <InfoRow label="Customer Type" value={customerType} />
        <InfoRow label="Currency" value={currencyCode} />
        <InfoRow label="Payment Terms" value={paymentTermName} />
        <InfoRow
          label="Portal Status"
          value={portal ? "Enabled" : "Disabled"}
        />
        <InfoRow label="Customer Language" value="English" />
      </Stack>
    </Paper>
  );
};

export default ContactDetailsCard;
