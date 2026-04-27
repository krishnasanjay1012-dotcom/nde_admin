import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import dayjs from "dayjs";
import { useInvoicesByClient } from "../../../hooks/Customer/Customer-hooks";

const UnpaidInvoice = ({ data }) => {
  const { data: invoice } = useInvoicesByClient({
    page: 1,
    limit: 50,
    filter: "pending",
    date_filter: "",
    customStartDate: "",
    customEndDate: "",
    searchTerm: "",
    workspace_Id: data?.workspace?._id,
  });

  const unpaidInvoice = invoice?.data || [];

  const getOverdueText = (dueDate) => {
    const today = dayjs();
    const due = dayjs(dueDate);

    const diff = today.diff(due, "day");

    if (diff > 0) return `OVERDUE BY ${diff} DAYS`;
    if (diff === 0) return "DUE TODAY";
    return `DUE IN ${Math.abs(diff)} DAYS`;
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        borderRadius: 1,
        bgcolor: "background.muted",
        px:2
      }}
    >
      {unpaidInvoice.map((item, index) => (
        <Box key={item._id}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              py: 1.5,
            }}
          >
            {/* LEFT */}
            <Box>
              <Typography sx={{ fontSize: 16 }}>
                {item.invoiceId}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "text.secondary",
                  mt: 0.5,
                }}
              >
                {dayjs(item.invoiceDate).format("DD/MM/YYYY")}
              </Typography>
            </Box>

            {/* RIGHT */}
            <Box textAlign="right">
              <Typography sx={{ fontSize: 16 }}>
                ₹{item.balance?.toFixed(2)}
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  color: "#ff6b2c",
                  mt: 0.5,
                }}
              >
                {getOverdueText(item.dueDate)}
              </Typography>
            </Box>
          </Box>

          {/* Divider */}
          {index !== unpaidInvoice.length - 1 && (
            <Divider sx={{ opacity: 1 }} />
          )}
        </Box>
      ))}
    </Box>
  );
};

export default UnpaidInvoice;