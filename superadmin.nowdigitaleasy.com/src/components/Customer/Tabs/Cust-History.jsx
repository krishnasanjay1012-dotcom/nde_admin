import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Skeleton,
  useTheme,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useLogs } from "../../../hooks/Customer/Customer-hooks";
import HistoryIcon from "@mui/icons-material/History";

import EmailIcon from "@mui/icons-material/Email";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PaymentIcon from "@mui/icons-material/Payment";
import GroupIcon from "@mui/icons-material/Group";

import CommonFilter from "../../common/NDE-CommonFilter";
import HistoryDetails from "./History-Details";
import FlowerLoader from "../../common/NDE-loader";

const EmptyLogs = () => (
  <Box
    sx={{
      textAlign: "center",
      py: 10,
      color: "text.secondary",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <HistoryIcon sx={{ fontSize: 60, mb: 2, color: "primary.main" }} />
    <Typography variant="h6" sx={{ mb: 1 }} color="text.secondary">
      No Logs Yet
    </Typography>
    <Typography variant="body2" sx={{ maxWidth: 400 }}>
      There are no activity logs yet.
    </Typography>
  </Box>
);

const SkeletonLogs = ({ count = 3 }) => (
  <Box sx={{ maxWidth: 700, mx: "auto", p: 3 }}>
    {Array.from(new Array(count)).map((_, idx) => (
      <Paper
        key={idx}
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
          p: 2,
          mb: 2,
          borderRadius: 3,
          boxShadow: 1,
        }}
      >
        <Box sx={{ width: 50, textAlign: "center" }}>
          <Skeleton variant="rectangular" width={40} height={40} />
          <Skeleton variant="text" width={30} height={15} sx={{ mt: 1 }} />
        </Box>

        <Skeleton variant="circular" width={34} height={34} />

        <Box sx={{ flex: 1 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="80%" height={15} sx={{ mt: 0.5 }} />
          <Skeleton variant="text" width="40%" height={12} sx={{ mt: 0.5 }} />
        </Box>
      </Paper>
    ))}
  </Box>
);

const getIcon = (type, theme) => {
  const normalized = (type || "").trim().toLowerCase();

  const bgColor = theme.palette.success.light;
  const iconColor = theme.palette.success.main;

  const icons = {
    email: <EmailIcon sx={{ fontSize: 20, color: iconColor }} />,
    payment: <PaymentIcon sx={{ fontSize: 20, color: iconColor }} />,
    paymentdetails: <PaymentIcon sx={{ fontSize: 20, color: iconColor }} />,
    order: <ShoppingCartIcon sx={{ fontSize: 20, color: iconColor }} />,
    invoice: <ReceiptIcon sx={{ fontSize: 20, color: iconColor }} />,
    user: <GroupIcon sx={{ fontSize: 20, color: iconColor }} />,
  };

  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        backgroundColor: bgColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icons[normalized] || (
        <HistoryIcon sx={{ fontSize: 20, color: iconColor }} />
      )}
    </Box>
  );
};

const historyOptions = [
  { label: "All", value: "all" },
  { label: "User", value: "user" },
  { label: "Order", value: "order" },
  { label: "Invoice", value: "invoice" },
  { label: "Payment", value: "paymentDetails" },
];

const History = ({ selectedWorkspaceId }) => {
  const theme = useTheme();
  const { customerId } = useParams();

  const [historyFilter, setHistoryFilter] = useState("all");
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const { data: fetchedData, isLoading } = useLogs({
    userId: customerId,
    workspace_Id: selectedWorkspaceId,
    page: pageNo,
    limit: 10,
    filter: historyFilter,
  });

  useEffect(() => {
    setPageNo(1);
    setData([]);
    setHasNext(true);
  }, [historyFilter]);

  useEffect(() => {
    if (fetchedData?.logData) {
      setData((prev) => {
        const merged =
          pageNo === 1
            ? fetchedData.logData
            : [...prev, ...fetchedData.logData];

        // remove duplicates using createdAt
        return merged.filter(
          (item, index, self) =>
            index ===
            self.findIndex((t) => t.createdAt === item.createdAt)
        );
      });

      setHasNext(fetchedData.hasNextPage);
    }
  }, [fetchedData, pageNo]);

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight + 20 &&
      !isLoading &&
      hasNext
    ) {
      setPageNo((prev) => prev + 1);
    }
  };

  const groupedData = data.reduce((acc, item) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    if (!acc[date]) acc[date] = [];
    acc[date].push(item);

    return acc;
  }, {});

  return (
    <Box>
      <Box sx={{ mt: 1, ml: 2, mb: 1 }}>
        <CommonFilter
          menuOptions={historyOptions}
          value={historyFilter}
          onChange={setHistoryFilter}
        />
      </Box>

      <Box
        sx={{
          p: 2,
          mx: "auto",
          overflow: "auto",
          maxHeight: "calc(100vh - 250px)",
        }}
        onScroll={handleScroll}
      >
        {data.length === 0 && isLoading && <SkeletonLogs />}

        {data.length === 0 && !isLoading && <EmptyLogs />}

        {Object.keys(groupedData).map((dateKey) => (
          <Box key={dateKey} sx={{ position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                left: 88,
                top: 32,
                bottom: 0,
                width: "1px",
                background: "#D1D1DB",
                zIndex: 1,
              }}
            />

            {groupedData[dateKey].map((item) => {
              const d = new Date(item.createdAt);
              const day = d.getDate().toString().padStart(2, "0");
              const month = d.toLocaleString("en-US", { month: "short" });
              const year = d.getFullYear();

              return (
                <Box
                  key={item.createdAt}
                  sx={{ display: "flex", alignItems: "flex-start", mb: 1 }}
                >
                  {/* DATE */}
                  <Box sx={{ width: 70, textAlign: "center" }}>
                    <Typography sx={{ fontSize: 24, fontWeight: 700 }}>
                      {day}
                    </Typography>
                    <Typography sx={{ fontSize: 11 }}>{month}</Typography>
                    <Typography sx={{ fontSize: 11 }}>{year}</Typography>
                  </Box>

                  {/* ICON */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      zIndex: 2,
                    }}
                  >
                    {getIcon(item.referenceModel, theme)}
                  </Box>

                  {/* CARD */}
                  <Paper
                    elevation={3}
                    sx={{
                      flex: 1,
                      p: 1.5,
                      borderRadius: "10px",
                      background: theme.palette.success.light,
                      borderLeft: `4px solid ${theme.palette.success.main}`,
                      ml: 3,
                      cursor: "pointer",
                      "&:hover": {
                        boxShadow: 6,
                        transform: "scale(1.01)",
                        transition: "0.2s",
                      },
                    }}
                    onClick={() => {
                      setSelectedHistory(item);
                      setHistoryDrawerOpen(true);
                    }}
                  >
                    <Box display="flex" justifyContent="space-between">
                      <Typography sx={{ fontWeight: 600 }}>
                        {item.message}
                      </Typography>

                      <Typography sx={{ fontSize: 12 }}>
                        {d.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </Typography>
                    </Box>

                    <Typography
                      sx={{ mt: 1, fontSize: 13, color: "#5B5B5B" }}
                    >
                      Reference Model: {item.referenceModel || "Unknown"}
                    </Typography>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        ))}

        {isLoading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <FlowerLoader size={20} />
          </Box>
        )}
      </Box>

      <HistoryDetails
        open={historyDrawerOpen}
        onClose={() => setHistoryDrawerOpen(false)}
        historyDetails={selectedHistory}
      />
    </Box>
  );
};

export default History;