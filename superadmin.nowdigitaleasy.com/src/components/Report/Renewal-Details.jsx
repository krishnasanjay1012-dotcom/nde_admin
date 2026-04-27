import { Box, Typography, Divider, Paper, Stack, Chip } from "@mui/material";
import { useResellerServiceDetailsByClient } from "../../hooks/suspension/suspension-hooks";
import FlowerLoader from "../common/NDE-loader";

const RenewalDetails = ({ domain }) => {
  const { data, isLoading, error } = useResellerServiceDetailsByClient({
    domain_name: domain,
  });

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <FlowerLoader />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography color="error">Failed to load Renewal details.</Typography>
      </Box>
    );
  }

  const details = data || {};

  const infoItems = [
    {
      label: "Domain Name",
      value: details?.domainname || "-",
    },
    {
      label: "Customer ID",
      value: details?.customerid || "-",
    },
    {
      label: "Purchase Date",
      value: details?.purchaseDate
        ? new Date(details.purchaseDate).toLocaleDateString("en-IN")
        : "-",
    },
    {
      label: "Expiry Date",
      value: details?.expiryDate
        ? new Date(details.expiryDate).toLocaleDateString("en-IN")
        : "-",
    },
    {
      label: "Action Status",
      value: details?.actionstatusdesc || "-",
    },
    {
      label: "Current Status",
      value: details?.currentstatus || "-",
      highlight: details?.currentstatus === "ACTIVE" ? "success" : "error",
    },
  ];

  return (
    <Box  sx={{ p: 1}}>
     <Stack spacing={1.5}>
        {infoItems.map((item) => (
          <Box
            key={item.label}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={1.5}
            sx={{
              borderRadius: 2,
              bgcolor: "#f9f9f9",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
          >
            <Typography variant="subtitle2" color="text.secondary">
              {item.label}
            </Typography>
            {item.highlight ? (
              <Chip
                label={item.value}
                color={item.highlight}
                size="small"
                sx={{ fontWeight: "bold" }}
              />
            ) : (
              <Typography variant="body1">{item.value}</Typography>
            )}
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default RenewalDetails;
