import { Box, Typography, Stack } from "@mui/material";
import React from "react";
import CommonDrawer from "../../common/NDE-Drawer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const Row = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 500 }}>
      {value || "--"}
    </Typography>
  </Stack>
);

const Section = ({ title, children }) => (
  <Box sx={{ mb: 2 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
        backgroundColor: "background.default",
        p: 1.5,
        borderRadius: "6px",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography>+</Typography>
    </Box>
    <Box sx={{ mt: 1, ml: 1, mr: 1 }}>{children}</Box>
  </Box>
);

const HistoryDetails = ({ open, onClose, historyDetails }) => {
  const reference = historyDetails?.referenceId;

  console.log(reference,'reference');
  

  const renderContent = () => {
    if (!reference) {
      return (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
            mt: 4,
          }}
        >
          <InfoOutlinedIcon sx={{ fontSize: 50, color: "primary.main" }} />
          <Typography variant="h6">No Data Available</Typography>
          <Typography variant="body2">
            There are no details to display for this history.
          </Typography>
        </Box>
      );
    }

    switch (historyDetails.referenceModel) {
      case "order":
        return (
          <Section title="Order Details">
            <Row label="Product:" value={reference.product} />
            <Row label="Domain:" value={reference.domainName} />
            <Row label="Quantity:" value={`${reference.quantity} user licenses`} />
            <Row label="Price per User:" value={`₹${reference.singleprice} / month`} />
            <Row label="Billing Cycle:" value={reference.period} />
            <Row label="Service Type:" value={reference.service_type} />
            <Row label="Service Enabled:" value={reference.service_enabled ? "Yes" : "No"} />
          </Section>
        );

      case "paymentDetails":
        return (
          <Section title="Payment Details">
            <Row label="Amount:" value={`₹${reference.amount}`} />
            <Row label="Currency:" value={reference.currency} />
            <Row label="Payment Method:" value={reference.paymentMethod} />
            <Row label="Status:" value={reference.status} />
            {reference.razorpayDetails && (
              <>
                <Row label="Razorpay Order ID:" value={reference.razorpayDetails.orderId} />
                <Row label="Razorpay Payment ID:" value={reference.razorpayDetails.paymentId} />
                <Row label="Fee:" value={`₹${reference.razorpayDetails.fee}`} />
                <Row label="Method:" value={reference.razorpayDetails.method} />
              </>
            )}
          </Section>
        );

      case "invoice":
        return (
          <Section title="Invoice Details">
            <Row label="Invoice No:" value={reference.invoice_no} />
            <Row label="Status:" value={reference.status} />
            <Row label="Payment Method:" value={reference.payment_method} />
            <Row label="Sub Total:" value={`₹${reference.sub_total}`} />
            <Row label="Amount:" value={`₹${reference.amount}`} />
            <Row label="Currency:" value={reference.currency} />
            <Row label="Due Date:" value={new Date(reference.due_date).toLocaleDateString()} />
            <Row label="CGST:" value={`₹${reference.cgst?.Amt} (${reference.cgst?.percentage}%)`} />
            <Row label="SGST:" value={`₹${reference.sgst?.Amt} (${reference.sgst?.percentage}%)`} />
          </Section>
        );

      default:
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 1,
              mt: 4,
            }}
          >
            <InfoOutlinedIcon sx={{ fontSize: 60, color: "primary.main" }} />
            <Typography variant="h6">No Data Available</Typography>
            <Typography variant="body2">
              There are no details to display for this history.
            </Typography>
          </Box>
        );
    }
  };

  return (
    <CommonDrawer open={open} onClose={onClose} anchor="right" width={600} title="History Details">
      <Box>{renderContent()}</Box>
    </CommonDrawer>
  );
};

export default HistoryDetails;
