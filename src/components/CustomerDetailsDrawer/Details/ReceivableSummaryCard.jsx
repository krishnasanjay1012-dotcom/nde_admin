import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";

const SummaryItem = ({ icon, iconBg, iconColor, label, value }) => (
  <Box
    sx={{
      flex: 1,
      p: 2,
      display: "flex",
      alignItems: "center",
      flexDirection: "column",
    }}
  >
    <Box
      sx={{
        width: 28,
        height: 28,
        borderRadius: "50%",
        backgroundColor: iconBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {React.cloneElement(icon, {
        sx: { fontSize: 18, color: iconColor },
      })}
    </Box>

    <Box>
      <Typography
        sx={{
          fontSize: 13,
          color: "#6B7280",
          mb: 0.5,
        }}
      >
        {label}
      </Typography>
    </Box>
    <Box>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {value}
      </Typography>
    </Box>
  </Box>
);

export default function ReceivableSummaryCard() {
  return (
    <Box
      sx={{
        display: "flex",
        border: "1px solid #E6E8F0",
        borderRadius: "12px",
        overflow: "hidden",
        backgroundColor: "#fff",
        mb: 3,
      }}
    >
      <SummaryItem
        icon={<WarningAmberRoundedIcon />}
        iconBg="#FFF4E5"
        iconColor="#F59E0B"
        label="Outstanding Receivables"
        value="Rs.19,985.23"
      />

      <Divider orientation="vertical" flexItem />

      <SummaryItem
        icon={<LocalOfferRoundedIcon />}
        iconBg="#ECFDF3"
        iconColor="#22C55E"
        label="Unused Credits"
        value="Rs.0.00"
      />
    </Box>
  );
}
