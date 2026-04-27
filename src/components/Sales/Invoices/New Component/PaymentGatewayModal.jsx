import React, { useState } from "react";
import {
  Box,
  Typography,
  Radio,
  FormControlLabel,
  RadioGroup,
  Avatar,
} from "@mui/material";
import CommonDialog from "../../../common/NDE-Dialog";
import CommonButton from "../../../common/NDE-Button";

// Import icons if available, otherwise use text/placeholders
// distinct styling for each gateway to match the screenshot roughly
import {
  SiRazorpay,
  SiPaytm,
  SiStripe,
  SiPaypal,
  SiZoho,
} from "react-icons/si";
import { FaCcVisa, FaCcMastercard } from "react-icons/fa";

const GatewayOption = ({ value, label, icon, recommended }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      p: 1.5,
      mb: 1,
      borderRadius: "4px",
      bgcolor: "#F9F9FB",
      border: "1px solid #eee",
      justifyContent: "space-between",
      width: "100%",
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <FormControlLabel
        value={value}
        control={<Radio size="small" />}
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {icon}
            <Typography fontWeight={600} fontSize={15} color="#333">
              {label}
            </Typography>
          </Box>
        }
        sx={{ m: 0 }}
      />
    </Box>
    {recommended && (
      <Box
        sx={{
          bgcolor: "#FFA726", // Orange/Yellowish
          color: "white",
          fontSize: "11px",
          fontWeight: 600,
          px: 1,
          py: 0.2,
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: 0.5,
        }}
      >
        ★ Preferred Gateway
      </Box>
    )}
  </Box>
);

export default function PaymentGatewayModal({ open, onClose }) {
  const [selectedGateway, setSelectedGateway] = useState("razorpay");

  const handleProceed = () => {
    onClose();
  };

  return (
    <CommonDialog
      open={open}
      onClose={onClose}
      title="Add Payment Gateway"
      width={500}
      onSubmit={handleProceed}
      submitLabel="Proceed"
      cancelLabel="Cancel"
    >
      <Box sx={{ p: 2 }}>
        <RadioGroup
          value={selectedGateway}
          onChange={(e) => setSelectedGateway(e.target.value)}
        >
          {/* Zoho (Preferred) */}
          <GatewayOption
            value="zoho"
            label="Zoho Payments"
            icon={<SiZoho color="#0069D9" size={24} />}
            recommended
          />

          {/* Razorpay */}
          <GatewayOption
            value="razorpay"
            label="Razorpay"
            icon={<SiRazorpay color="#072654" size={24} />}
          />

          {/* Paytm */}
          <GatewayOption
            value="paytm"
            label="Paytm PG"
            icon={<SiPaytm color="#00BAF2" size={24} />}
          />

          {/* Stripe */}
          <GatewayOption
            value="stripe"
            label="stripe"
            icon={<SiStripe color="#635BFF" size={24} />}
          />

          {/* PayPal */}
          <GatewayOption
            value="paypal"
            label="PayPal"
            icon={<SiPaypal color="#003087" size={24} />}
          />

          {/* Verifone */}
          <GatewayOption
            value="verifone"
            label="verifone"
            icon={
              <Typography
                fontWeight={800}
                fontSize={16}
                letterSpacing={-0.5}
                color="#000"
              >
                Verifone
              </Typography>
            }
          />

          {/* Eazypay */}
          <GatewayOption
            value="eazypay"
            label="eazypay"
            icon={
              <Typography fontWeight={700} fontSize={16} color="#E85E25">
                eazypay
                <Typography
                  component="span"
                  fontSize={10}
                  color="#000"
                  sx={{ display: "block", lineHeight: 1 }}
                >
                  ICICI Bank
                </Typography>
              </Typography>
            }
          />
        </RadioGroup>
      </Box>
    </CommonDialog>
  );
}
