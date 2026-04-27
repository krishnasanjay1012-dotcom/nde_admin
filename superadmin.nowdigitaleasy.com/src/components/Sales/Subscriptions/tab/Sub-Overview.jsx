import React from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Avatar,
  Skeleton,
} from "@mui/material";
import { useSubscriptionById } from "../../../../hooks/subscriptions/subscriptions-hooks";

export default function SubscriptionOverview({ selectedSubscription }) {
  const { data: subscriptionData, isLoading } = useSubscriptionById(
    selectedSubscription?._id
  );

  const sub = subscriptionData?.data || {};

  const {
    _id,
    quantity = 0,
    unitPrice = 0,
    totalAmount = 0,
    autoRenew,
    isTrial,
    status,
    startDate,
    endDate,
    nextBillingDate,
    statusHistory = [],
  } = sub;

  const planName = sub?.planId?.plan_name || "Plan";
  const billing_cycle = sub?.meta_data?.billingCycleType || "-";

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "-";

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
          flexShrink: 0,
          borderRight: { xs: "none", md: "1px solid #EBEBEF" },
          display: "flex",
          flexDirection: "column",
          minHeight: "100%",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            px: 2,
            py: 1.5,
            borderBottom: "1px solid #EBEBEF",
          }}
        >
          {isLoading ? (
            <>
              <Box sx={{ flex: 1 }}>
                <Skeleton width="70%" />
                <Skeleton width="40%" />
              </Box>
            </>
          ) : (
            <>
              <Box>
                <Typography fontWeight={600} fontSize={15}>
                  {planName}
                </Typography>
                <Typography fontSize={12} color="text.secondary">
                  Status: {status?.toUpperCase()}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
          {isLoading ? (
            <>
              <Skeleton height={25} />
              <Skeleton height={25} />
              <Skeleton height={25} />
              <Skeleton height={25} />
              <Skeleton height={25} />
            </>
          ) : (
            <>
              <Typography fontWeight={600} fontSize={13} mb={1}>
                SUBSCRIPTION DETAILS
              </Typography>

              <Typography fontSize={13}>Subscription ID: {_id}</Typography>
              <Typography fontSize={13}>Plan: {planName}</Typography>
              <Typography fontSize={13}>
                Billing Cycle: {billing_cycle}
              </Typography>
              <Typography fontSize={13}>
                Auto Renew: {autoRenew ? "Enabled" : "Disabled"}
              </Typography>
              <Typography fontSize={13}>
                Trial Plan: {isTrial ? "Yes" : "No"}
              </Typography>

              <Box mt={3}>
                <Typography fontWeight={600} fontSize={13} mb={1}>
                  DURATION
                </Typography>

                <Typography fontSize={13}>
                  Start Date: {formatDate(startDate)}
                </Typography>
                <Typography fontSize={13}>
                  End Date: {formatDate(endDate)}
                </Typography>
                <Typography fontSize={13}>
                  Current Period: {formatDate(startDate)} –{" "}
                  {formatDate(endDate)}
                </Typography>
              </Box>

              <Box mt={3}>
                <Typography fontWeight={600} fontSize={13} mb={1}>
                  STATUS HISTORY
                </Typography>

                {statusHistory.map((item, index) => (
                  <Box key={index} mb={1}>
                    <Typography fontSize={13}>
                      {item.status?.toUpperCase()} –{" "}
                      {formatDate(item.changedAt)}
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      {item.reason}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* SUMMARY */}
        <Box sx={{ px: 2, py: 2, display: "flex", gap: 4, flexWrap: "wrap" }}>
          {isLoading ? (
            <>
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
              <Skeleton width={120} height={40} />
            </>
          ) : (
            <>
              <Box>
                <Typography variant="caption">Subscription Amount</Typography>
                <Typography fontWeight={600}>
                  ₹{unitPrice?.toFixed(2)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption">Next Billing Date</Typography>
                <Typography fontWeight={600}>
                  {formatDate(nextBillingDate)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption">
                  Current Period Ends
                </Typography>
                <Typography fontWeight={600}>
                  {formatDate(endDate)}
                </Typography>
              </Box>

              <Box>
                <Typography variant="caption">Renewal</Typography>
                <Typography fontWeight={600}>
                  {autoRenew ? "Automatic" : "Manual"}
                </Typography>
              </Box>
            </>
          )}
        </Box>

        {/* TABLE */}
        <Box sx={{ px: 2, py: 2 }}>
          {isLoading ? (
            <>
              <Skeleton height={40} />
              <Skeleton height={40} />
              <Skeleton height={40} />
            </>
          ) : (
            <Table
              size="small"
              sx={{
                border: "1px solid #EBEBEF",
                "& td, & th": { fontSize: 13 },
              }}
            >
              <TableHead sx={{ backgroundColor: "background.muted" }}>
                <TableRow>
                  <TableCell>ITEM DETAILS</TableCell>
                  <TableCell>QUANTITY</TableCell>
                  <TableCell>PRICE</TableCell>
                  <TableCell>AMOUNT</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell>{planName}</TableCell>
                  <TableCell>{quantity}</TableCell>
                  <TableCell>₹{unitPrice?.toFixed(2)}</TableCell>
                  <TableCell>₹{totalAmount?.toFixed(2)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          )}
        </Box>

        {/* TOTAL */}
        {!isLoading && (
          <Box
            sx={{
              px: 2,
              py: 1.5,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Box textAlign="right" fontSize={13}>
              <Typography>Round Off: ₹0.00</Typography>
              <Typography fontWeight={600}>
                TOTAL ₹{totalAmount?.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}