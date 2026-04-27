import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Divider,
  Stack,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Chip,
  TableHead,
} from "@mui/material";

import {
  useBillingCycles,
  usePlanById,
  usePlanPricings,
  useProductById,
} from "../../../hooks/products/products-hooks";

const PlanDetails = ({ plan }) => {
  const { data: fetchedPlan, refetch, isLoading } = usePlanById(plan?._id, false);
  const [planData, setPlanData] = useState(null);
  // const { data: productResponse } = useProductById(initialData?._id);



  const { data: pricings = {} } = usePlanPricings(plan?._id, !!plan?._id);
  const pricingData = pricings?.data || [];


  const activeCurrencyId = useMemo(() => {
    const defaultCurrency = pricingData.find(
      (p) => p?.currency_id?.isdefault === true
    );

    return defaultCurrency?.currency_id?._id;
  }, [pricingData]);



  const { data: billingRes = {} } = useBillingCycles(
    {
      plan_id: plan?._id,
      currency_id: activeCurrencyId,
    },
    {
      enabled: !!plan?._id && !!activeCurrencyId,
    }
  );

  const billingCycles = billingRes || [];



  useEffect(() => {
    if (plan?._id) refetch();
  }, [plan?._id, refetch]);

  useEffect(() => {
    if (fetchedPlan?.data) setPlanData(fetchedPlan.data);
  }, [fetchedPlan]);

  if (isLoading || !planData) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={500} gutterBottom>
            {planData.plan_name}
          </Typography>

          <Stack direction="row" spacing={1}>
            <Chip
              label={planData.is_active ? "Active" : "Inactive"}
              size="small"
              color={planData.is_active ? "success" : "default"}
            />

            <Chip label={planData.type?.toUpperCase()} size="small" color="primary" />

            {planData.isDeleted && <Chip label="Deleted" size="small" color="error" />}
          </Stack>
        </Box>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      {/* Basic Information */}
      <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
        Basic Information
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" color="text.secondary">
            Description
          </Typography>
          <Typography variant="body1">{planData.description || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" color="text.secondary">
            HSN Code
          </Typography>
          <Typography variant="body1">{planData.hsn_code || "-"}</Typography>
        </Grid>

        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" color="text.secondary">
            Trial Days
          </Typography>
          <Typography variant="body1">{planData.trial_days || 0}</Typography>
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography variant="subtitle1" color="text.secondary">
            Unit
          </Typography>
          <Typography variant="body1">{planData.productDetails?.unit || "-"}</Typography>
        </Grid>
      </Grid>


      <Typography variant="h6" fontWeight={500} sx={{ mb: 1 }}>
        Plan Features
      </Typography>

      <TableContainer component={Paper} sx={{ mt: 1, borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Tooltip</TableCell>
              <TableCell>Tag</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {planData?.plan_feature?.length > 0 ? (
              planData.plan_feature.map((group) => (
                <React.Fragment key={group._id}>
                  <TableRow sx={{ bgcolor: "grey.100" }}>
                    <TableCell colSpan={4}>
                      <Typography fontWeight={600}>{group.heading}</Typography>
                    </TableCell>
                  </TableRow>

                  {group.features?.map((feature, index) => (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{feature.name}</TableCell>
                      <TableCell>{feature.tool_tip_name || "-"}</TableCell>
                      <TableCell>
                        {feature.add_new_tag ? (
                          <Chip label="New" size="small" color="primary" />
                        ) : (
                          "-"
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Plan Features
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ---------------- PRICING ---------------- */}

      <Typography variant="h6" fontWeight={500} sx={{ mt: 3, mb: 1 }}>
        Pricing
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Setup Fee</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pricingData.length > 0 ? (
              pricingData.map((price, index) => (
                <TableRow key={price._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{price.currency_id?.code || "-"}</TableCell>
                  <TableCell>{price.setup_fee ?? "-"}</TableCell>

                  <TableCell>
                    {price.is_active ? (
                      <Chip label="Active" size="small" color="success" />
                    ) : (
                      <Chip label="Inactive" size="small" />
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No Pricing
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h6" fontWeight={500} sx={{ mt: 3, mb: 1 }}>
        Billing Cycles - (Default Currency Price)
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: "background.default" }}>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Billing Cycle</TableCell>
              <TableCell>Register Price</TableCell>
              <TableCell>Renewal Price</TableCell>
              <TableCell>Transfer Price</TableCell>
              <TableCell>Register Strike Amount</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {billingCycles.length > 0 ? (
              billingCycles.map((cycle, index) => (
                <TableRow key={cycle._id}>
                  <TableCell>{index + 1}</TableCell>

                  <TableCell>{cycle.plan_billing_cycle?.label || "-"}</TableCell>

                  <TableCell>{cycle.register_price ?? "-"}</TableCell>

                  <TableCell>{cycle.renewal_price ?? "-"}</TableCell>

                  <TableCell>{cycle.transfer_price ?? "-"}</TableCell>

                  <TableCell>{cycle.register_strike_amount ?? "-"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No Billing Cycles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default PlanDetails;