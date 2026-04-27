import React from "react";
import {
  Box,
  Typography,
  Paper,
} from "@mui/material";

const historyData = [
  {
    id: 1,
    date: "Today",
    time: "10:30 AM",
    createdBy: "John Doe",
    title: "Order #12345",
    description: "Payment received",
    status: "Completed",
  },
  {
    id: 2,
    date: "Today",
    time: "12:15 PM",
    createdBy: "Jane Smith",
    title: "Order #12346",
    description: "Pending shipment",
    status: "Pending",
  },
  {
    id: 3,
    date: "Yesterday",
    time: "03:45 PM",
    createdBy: "Mike Johnson",
    title: "Order #12340",
    description: "Payment failed",
    status: "Failed",
  },
];

const ItemHistory = () => {
  const groupedData = historyData.reduce((acc, item) => {
    (acc[item.date] = acc[item.date] || []).push(item);
    return acc;
  }, {});

  return (
    <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
      {Object.keys(groupedData).map((date) => (
        <Box key={date} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, color: "primary.main" }}>
            {date}
          </Typography>
          {groupedData[date].map((item) => (
            <Paper
              key={item.id}
              elevation={2}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid #D1D1D1",
                borderRadius: 2,
                "&:hover": {
                  boxShadow: 6,
                  transform: "scale(1.01)",
                  transition: "0.2s",
                },
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.time}
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {item.description}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Created by: {item.createdBy}
              </Typography>
            </Paper>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export default ItemHistory;
