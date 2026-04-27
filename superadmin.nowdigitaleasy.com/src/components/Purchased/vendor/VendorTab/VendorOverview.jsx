import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Skeleton,
} from "@mui/material";
import { useGetVendorInfo } from "../../../../hooks/Vendor/Vendor-hooks";

export default function VendorOverview({ selectedVendor }) {
  const { data: vendorData, isLoading } = useGetVendorInfo(selectedVendor?._id);

  const vendor = vendorData?.data || {};

  const {
    first_name,
    last_name,
    companyName,
    email,
    phone_number,
    paymentTermName,
    billing_address_details,
    shipping_address_details,
    opening_balance,
  } = vendor;

  const outstanding_balance = opening_balance || 0;

  const formatAddress = (addr) => {
    if (!addr?.address) return null;
    return `${addr.address}, ${addr.city}, ${addr.state}, ${addr.country}`;
  };

  const fullName =
    `${first_name || ""} ${last_name || ""}`.trim() || companyName || "-";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        height: "calc(100vh - 180px)",
        overflow: "hidden",
      }}
    >
      {/* LEFT PANEL */}
      <Box
        sx={{
          width: { xs: "100%", md: 300 },
          borderRight: { xs: "none", md: "1px solid #EBEBEF" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #EBEBEF",
          }}
        >
          {isLoading ? (
            <>
              <Skeleton width="70%" />
              <Skeleton width="40%" />
            </>
          ) : (
            <>
              <Typography fontWeight={500} fontSize={15}>
                {fullName}
              </Typography>
              <Typography fontSize={12} color="text.secondary">
                {email}
              </Typography>
            </>
          )}
        </Box>

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
          {isLoading ? (
            <>
              <Skeleton height={25} />
              <Skeleton height={25} />
            </>
          ) : (
            <>
              {/* VENDOR DETAILS */}
              <Typography fontWeight={500} fontSize={13} mb={1}>
                VENDOR DETAILS
              </Typography>

              <Typography fontSize={13}>Company: {companyName}</Typography>
              <Typography fontSize={13}>Phone: {phone_number}</Typography>

              {/* ADDRESS SECTION */}
              <Box mt={3}>
                <Typography fontWeight={500} fontSize={14} mb={1}>
                  ADDRESS
                </Typography>

                {/* Billing */}
                <Box mb={2}>
                  <Typography fontSize={13} fontWeight={500}>
                    Billing Address
                  </Typography>

                  {formatAddress(billing_address_details) ? (
                    <Typography fontSize={13} color="text.secondary">
                      {formatAddress(billing_address_details)}
                    </Typography>
                  ) : (
                    <Typography fontSize={13} color="text.secondary">
                      No Billing Address
                      {/* <span style={{ color: "#1976d2", cursor: "pointer" }}>
                        New Address
                      </span> */}
                    </Typography>
                  )}
                </Box>

                {/* Shipping */}
                <Box>
                  <Typography fontSize={13} fontWeight={500}>
                    Shipping Address
                  </Typography>

                  {formatAddress(shipping_address_details) ? (
                    <Typography fontSize={13} color="text.secondary">
                      {formatAddress(shipping_address_details)}
                    </Typography>
                  ) : (
                    <Typography fontSize={13} color="text.secondary">
                      No Shipping Address 
                      {/* <span style={{ color: "#1976d2", cursor: "pointer" }}>
                        New Address
                      </span> */}
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* PAYMENT TERMS */}
              <Box mt={3}>
                <Typography fontWeight={500} fontSize={13} mb={1}>
                  PAYMENT TERMS
                </Typography>

                <Typography fontSize={13}>
                  Terms: {paymentTermName}
                </Typography>
                <Typography fontSize={13}>
                  Outstanding Balance: ₹{outstanding_balance.toFixed(2)}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* RIGHT PANEL */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      
        {/* PAYABLES TABLE */}
        {!isLoading && (
          <Box sx={{ px: 2, py: 2 }}>
            <Typography fontWeight={500} fontSize={14} mb={1}>
              Payables
            </Typography>

            <Table
              size="small"
              sx={{
                border: "1px solid #EBEBEF",
                "& th": {
                  backgroundColor: "#F5F6FA",
                  fontSize: 12,
                  color: "#6B7280",
                },
                "& td": { fontSize: 13 },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>OUTSTANDING PAYABLES</TableCell>
                  <TableCell>UNUSED CREDITS</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>
                    ₹{outstanding_balance.toFixed(2)}
                  </TableCell>
                  <TableCell>₹0.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        )}
      </Box>
    </Box>
  );
}