import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Collapse,
  Paper,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const isAddressEmpty = (address) => {
  if (!address) return true;

  return !Object.values(address).some(
    (value) => value !== null && value !== undefined && value !== ""
  );
};

const renderAddress = (address) => {
  if (isAddressEmpty(address)) {
    return (
      <Typography color="text.secondary">
        No Address Available
      </Typography>
    );
  }

  return (
    <>
      {address.address && <Typography>{address.address}</Typography>}
      {address.city && <Typography>{address.city}</Typography>}
      {address.state && <Typography>{address.state}</Typography>}
      {address.country && <Typography>{address.country}</Typography>}
      {address.pinCode && <Typography>PIN: {address.pinCode}</Typography>}
      {address.phone && <Typography>Phone: {address.phone}</Typography>}
      {address.faxNumber && <Typography>Fax: {address.faxNumber}</Typography>}
    </>
  );
};

const AddressCard = ({ shippingAddress, billingAddress }) => {
  const [openAddress, setOpenAddress] = useState(true);

  return (
    <Paper variant="outlined" sx={{ borderRadius: "12px" }}>
      <Box
        p={2}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        onClick={() => setOpenAddress(!openAddress)}
        sx={{ cursor: "pointer" }}
      >
        <Typography sx={{ fontWeight: 600 }}>Address</Typography>

        <IconButton size="small" sx={{ p: 0 }}>
          <ExpandMoreIcon
            sx={{
              transform: openAddress ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.2s",
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={openAddress}>
        <Divider />
        <Box p={2}>
          {/* Billing */}
          <Typography color="text.secondary" mb={1}>
            Billing Address
          </Typography>
          {isAddressEmpty(billingAddress) ? (
            <Typography color="text.secondary">
              No Billing Address
            </Typography>
          ) : (
            renderAddress(billingAddress)
          )}

          <Divider sx={{ my: 2 }} />

          {/* Shipping */}
          <Typography color="text.secondary" mb={1}>
            Shipping Address
          </Typography>
          {isAddressEmpty(shippingAddress) ? (
            <Typography color="text.secondary">
              No Shipping Address
            </Typography>
          ) : (
            renderAddress(shippingAddress)
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

export default AddressCard;