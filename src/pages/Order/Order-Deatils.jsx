import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Avatar,
  Stack,
  Tooltip,
  Divider,
} from "@mui/material";
import { useAdminOrderById } from "../../hooks/order/order-hooks";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import FlowerLoader from "../../components/common/NDE-loader";

const OrderDetailsOverView = ({ orderId }) => {
  const { data, isLoading } = useAdminOrderById(orderId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <FlowerLoader />
      </Box>
    );
  }

  const order = data?.data;
  const client = order?.clientId;
  const payment = order?.paymentDetails;

  if (!order) return <Typography>No data found.</Typography>;

  const cardStyles = {
    borderRadius: 2,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    width: "100%",
    height: '100%'
  };

  const renderRow = (label, value, highlight) => (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={0.7}
      borderBottom="1px dashed #e0e0e0"
    >
      <Typography color="text.secondary" noWrap>
        {label}
      </Typography>
      <Tooltip title={value} arrow>
        <Typography
          textAlign="right"
          fontWeight={highlight ? "bold" : "inherit"}
          color={highlight}
          sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {value}
        </Typography>
      </Tooltip>
    </Box>
  );

  return (
    <Box
      sx={{
        flex: 1,
        overflow: "auto",
        maxHeight: "calc(100vh - 180px)",
        display: "flex",
        flexDirection: "column",        
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* Order Header */}
        <Box display="flex" alignItems="center" gap={2} mb={1}>
          <Avatar sx={{ bgcolor: "primary.main" }}>
            <LocalMallIcon sx={{ color: "icon.light" }} />
          </Avatar>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">
              Order #{order?.orderId || "N/A"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Customer: {client?.first_name || "N/A"} {client?.last_name || ""}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {order?.createdAt ? new Date(order.createdAt).toLocaleString("en-IN") : "N/A"}
            </Typography>
          </Box>

          <Box flexGrow={1} />

          <Chip
            label={order?.orderStatus || "N/A"}
            color={
              order?.orderStatus === "pending"
                ? "warning"
                : order?.orderStatus === "success"
                  ? "success"
                  : "default"
            }
            size="small"
            sx={{ textTransform: "capitalize", fontWeight: "bold" }}
          />
        </Box>

        <Divider />

        {/* Scrollable Content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Order Summary */}
          <Card sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}>
                  <LocalMallIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  Order Summary
                </Typography>
              </Box>
              <Stack spacing={0.5}>
                {renderRow("Service Type", order?.service_type || "N/A")}
                {renderRow(
                  "Amount (Excl. GST)",
                  `₹${order?.amount_without_gst?.toLocaleString("en-IN") || 0}`
                )}
                {renderRow(
                  "GST Details",
                  `CGST ${order?.cgst?.percentage || 0}% (₹${order?.cgst?.Amt?.toLocaleString("en-IN") || 0
                  }) + SGST ${order?.sgst?.percentage || 0}% (₹${order?.sgst?.Amt?.toLocaleString("en-IN") || 0
                  })`
                )}
                {renderRow(
                  "Total Amount",
                  `₹${order?.total_amount?.toLocaleString("en-IN") || 0}`,
                  "primary.main"
                )}
                {renderRow(
                  "Balance Due",
                  `₹${order?.balanceDue?.toLocaleString("en-IN") || 0}`,
                  "error.main"
                )}
              </Stack>
            </CardContent>
          </Card>

          {/* Client Details */}
          <Card sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Avatar sx={{ bgcolor: "#e3f2fd", color: "#1976d2" }}>
                  <AccountCircleIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  Client Details
                </Typography>
              </Box>
              <Stack spacing={0.5}>
                {renderRow("Name", `${client?.first_name || "N/A"} ${client?.last_name || ""}`)}
                {renderRow("Email", client?.email || "N/A")}
                {renderRow(
                  "Phone",
                  `${client?.phone_number_code || ""} ${client?.phone_number || "N/A"}`
                )}
                {renderRow("Country", client?.country || "N/A")}
              </Stack>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card sx={cardStyles}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                <Avatar sx={{ bgcolor: "#e8f5e9", color: "#388e3c" }}>
                  <PaymentIcon />
                </Avatar>
                <Typography variant="subtitle1" fontWeight="bold">
                  Payment Information
                </Typography>
              </Box>
              <Stack spacing={0.5}>
                {renderRow("Method", payment?.paymentMethod || "N/A")}
                {renderRow(
                  "Wallet Used",
                  `₹${payment?.wallet?.amount?.toLocaleString("en-IN") || 0}`
                )}
                {renderRow("Razorpay ID", payment?.razorpayDetails?.orderId || "N/A")}
                <Box display="flex" justifyContent="space-between" alignItems="center" py={0.7}>
                  <Typography color="text.secondary">Status</Typography>
                  <Chip
                    label={payment?.status || "N/A"}
                    color={
                      payment?.status === "pending"
                        ? "warning"
                        : payment?.status === "completed"
                          ? "success"
                          : "default"
                    }
                    size="small"
                    sx={{ textTransform: "capitalize" }}
                  />
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default OrderDetailsOverView;
