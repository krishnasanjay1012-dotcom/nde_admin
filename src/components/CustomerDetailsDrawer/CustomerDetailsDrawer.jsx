import React, { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Avatar,
  Tabs,
  Tab,
  Divider,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import ReceivableSummaryCard from "./Details/ReceivableSummaryCard";
import ContactDetailsCard from "./Details/ContactDetailsCard";
import ContactPersonsCard from "./Details/ContactPersonsCard";
import AddressCard from "./Details/AddressCard";
import BasicInfo from "./BasicInfo";
import ActivityLog from "./ActivityLog/ActivityLog";
import { useGetCustomerInfo } from "../../hooks/dashboard/dashboard";
import FlowerLoader from "../common/NDE-loader";
// import { useGetCustomerInfo } from "../../hooks/Customer/Customer-hooks";

export default function CustomerDetailsDrawer({ open, onClose, customerId }) {
  const { data: customerData, isLoading: isFetching } =
    useGetCustomerInfo(customerId);
  const [tab, setTab] = useState(0);

  const customerName = `${customerData?.data?.first_name} ${customerData?.data?.last_name}`;
  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") {
      return "--";
    }
    return value;
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: "30vw" } }}
    >
      {isFetching ? (
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
          width={"100%"}
        >
          <FlowerLoader />
        </Box>
      ) : (
        <>
          <Box p={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Avatar sx={{ bgcolor: "#e0e0e0", color: "#555" }}>V</Avatar>
              <Box flex={1}>
                <Typography variant="caption" color="text.secondary">
                  Customer
                </Typography>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography fontWeight={600}>{customerName}</Typography>
                  <OpenInNewIcon fontSize="small" color="primary" />
                </Stack>
              </Box>
              <IconButton onClick={onClose}>
                <CloseIcon />
              </IconButton>
            </Stack>
          </Box>

          <Divider />
          <BasicInfo
            email={formatValue(customerData?.data?.email)}
            website={formatValue(customerData?.data?.website)}
          />

          <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2 }}>
            <Tab label="Details" />
            <Tab label="Activity Log" />
          </Tabs>

          <Divider />

          <Box p={2} sx={{ overflowY: "auto" }}>
            {tab === 0 && (
              <>
                <ReceivableSummaryCard />
                <ContactDetailsCard
                  currencyCode={formatValue(customerData?.data?.currencyCode)}
                  portal={customerData.data.allow_portal}
                  customerType={formatValue(customerData?.data?.customer_type)}
                  paymentTermName={formatValue(
                    customerData?.data?.paymentTermName,
                  )}
                />

                <ContactPersonsCard
                  contactPerson={customerData?.data?.contact_persons ?? []}
                />

                <AddressCard
                  shippingAddress={customerData?.data?.shipping_address_details}
                  billingAddress={customerData?.data?.billing_address_details}
                />
              </>
            )}

            {tab === 1 && <ActivityLog customerId={customerId} />}
          </Box>
        </>
      )}
    </Drawer>
  );
}
