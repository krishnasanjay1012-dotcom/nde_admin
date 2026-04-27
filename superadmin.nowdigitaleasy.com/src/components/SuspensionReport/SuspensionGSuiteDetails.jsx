import { Box, Typography, Divider } from "@mui/material";
import { useGSuiteServiceDetailsByClient } from "../../hooks/suspension/suspension-hooks";
import FlowerLoader from "../common/NDE-loader";

const GSuiteDetailsComp = ({ customerId, skuId }) => {
  const { data, isLoading, error } = useGSuiteServiceDetailsByClient({ customerId, skuId });

  const details = data || {};

  // Handle loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="300px">
        <FlowerLoader />
      </Box>
    );
  }

  // Handle error state (network error or API error object)
  if (error || details?.error) {
    const errorMessage = error?.message || details?.error?.message || "Failed to load GSuite details.";
    return (
      <Box p={2}>
        <Typography color="error">{errorMessage}</Typography>
      </Box>
    );
  }

  // Helper to format dates safely
  const formatDate = (dateStr) => (dateStr ? new Date(dateStr).toLocaleDateString("en-IN") : "-");

  return (
    <Box p={2}>

      <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Customer Domain
          </Typography>
          <Typography>{details?.customerDomain || "-"}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Customer ID
          </Typography>
          <Typography>{details?.customerId || customerId}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            SKU ID
          </Typography>
          <Typography>{details?.skuId || skuId || "-"}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Plan
          </Typography>
          <Typography>
            {details?.plan
              ? `${details.plan.planName}${
                  details.plan.isCommitmentPlan && details.plan.commitmentInterval
                    ? ` (${new Date(Number(details.plan.commitmentInterval.startTime)).toLocaleDateString(
                        "en-IN"
                      )} - ${new Date(Number(details.plan.commitmentInterval.endTime)).toLocaleDateString("en-IN")})`
                    : ""
                }`
              : "-"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            License Count
          </Typography>
          <Typography>
            {details?.seats
              ? `Used: ${details.seats.numberOfSeats || 0}, Licensed: ${
                  details.seats.licensedNumberOfSeats || 0
                }, Max: ${details.seats.maximumNumberOfSeats || 0}`
              : "-"}
          </Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Order Date
          </Typography>
          <Typography>{formatDate(details?.orderdate)}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Expiry Date
          </Typography>
          <Typography>{formatDate(details?.expirydate)}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Alternate Email
          </Typography>
          <Typography>{details?.alternateEmail || "-"}</Typography>
        </Box>

        <Box>
          <Typography variant="subtitle2" color="text.secondary">
            Status
          </Typography>
          <Typography color={details?.status === "Active" ? "green" : "red"}>
            {details?.status || "-"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GSuiteDetailsComp;
