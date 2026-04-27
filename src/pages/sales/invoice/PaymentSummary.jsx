import React from "react";
import {
  Box,
  Typography,
  Divider,
} from "@mui/material";
import SouthWestIcon from "@mui/icons-material/SouthWest";

export default function PaymentSummary({ data }) {

  const symbol = data?.symbol || "₹";

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return `${symbol}0.00`;

    return `${symbol}${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const summaryItems = [
    {
      label: "Total Outstanding Receivables",
      value: data?.data?.["Total Outstanding Receivables"],
    },
    {
      label: "Due Today",
      value: data?.data?.["Today Balance Payments"],
      color: "#f59e0b",
    },
    {
      label: "Due Within 30 Days",
      value: data?.data?.["One Month Balance Payments"],
    },
    {
      label: "Overdue Invoice",
      value: data?.data?.["Over Due Payments"],
    },
    {
      label: "Average No. of Days for Getting Paid",
      value: `${data?.data?.["Average Payment Days"] || 0} Days`,
      isDays: true,
    },
  ];

  return (
    <Box sx={{ width: "100%",px:1,mb:1 }}>
      <Box
        sx={{
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          border: "1px solid #D1D1D1" 
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexWrap: "wrap" }}>
          <Box>
            <Typography
              sx={{
                fontSize: "13px",
                fontWeight: 600,
                mb: 1,
              }}
            >
              PAYMENT SUMMARY
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap" }}>

              {/* Icon */}
              <Box
                sx={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  backgroundColor: "#f4c46a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <SouthWestIcon fontSize="small" sx={{ color: "#5f4b1c" }} />
              </Box>

              {summaryItems.map((item, index) => (
                <React.Fragment key={index}>
                  <Box>
                    <Typography sx={{ fontSize: 13}}>
                      {item.label}
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 16,
                        color: item.color,
                      }}
                    >
                      {item.isDays
                        ? item.value
                        : formatCurrency(item.value)}
                    </Typography>
                  </Box>

                  {index !== summaryItems.length - 1 && (
                    <Divider orientation="vertical" flexItem />
                  )}
                </React.Fragment>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}