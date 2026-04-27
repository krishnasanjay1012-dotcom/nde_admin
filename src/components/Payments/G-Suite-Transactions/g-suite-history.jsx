import React, { useEffect, useState, useRef } from "react";
import { Box, Typography, Paper, useTheme, Tooltip, Skeleton, IconButton } from "@mui/material";
import CommonDrawer from "../../common/NDE-Drawer";
import InfoIcon from '@mui/icons-material/Info';
import GoogleIcon from '@mui/icons-material/Google';
import { useGSuiteTransactionByDomain } from "../../../hooks/payment/payment-hooks";
import CommonYearDatePicker from "../../common/NDE-YearDatePicker";
import ClearIcon from '@mui/icons-material/Clear';
import CommonFilter from "../../common/NDE-CommonFilter";
import FlowerLoader from "../../common/NDE-loader";

const GSuiteHistory = ({ open, onClose, domain }) => {
  const theme = useTheme();
  const [currency, setCurrency] = useState("all");
  const [pageNo, setPageNo] = useState(1);
  const [hasNext, setHasNext] = useState(true);
  const [selectedYear, setSelectedYear] = useState("");
  const [data, setData] = useState([]);

  const scrollRef = useRef();

  const currencyOptions = [
    { label: "All", value: "all" },
    { label: "Year", value: "year" },
  ];

  const { data: fetchedData, isLoading } = useGSuiteTransactionByDomain({
    domain,
    filter: currency,
    year: selectedYear,
    page: pageNo,
    limit: 10,
  });

  useEffect(() => {
    setPageNo(1);
    setData([]);
    setHasNext(true);
  }, [currency, selectedYear, domain]);

  useEffect(() => {
    if (fetchedData?.data) {
      setData(prev => {
        const merged =
          pageNo === 1 ? fetchedData.data : [...prev, ...fetchedData.data];

        // Remove duplicates
        return merged.filter(
          (item, index, self) => index === self.findIndex(t => t._id === item._id)
        );
      });

      setHasNext(fetchedData.data.length === 10);
    }
  }, [fetchedData, pageNo]);

  const handleScroll = () => {
    const container = scrollRef.current;
    if (!container || isLoading || !hasNext) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    if (scrollHeight - scrollTop <= clientHeight + 50) {
      setPageNo(prev => prev + 1);
    }
  };

  const renderSkeleton = () =>
    Array.from({ length: 4 }).map((_, index) => (
      <Box key={index} sx={{ display: "flex", alignItems: "flex-start", mb: 3 }}>
        <Box sx={{ width: 70, textAlign: "center" }}>
          <Skeleton variant="text" width={30} height={30} sx={{ mx: "auto" }} />
          <Skeleton variant="text" width={40} height={14} sx={{ mx: "auto" }} />
          <Skeleton variant="text" width={40} height={14} sx={{ mx: "auto" }} />
        </Box>

        <Box
          sx={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            backgroundColor: theme.palette.grey[300],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: 1.5,
          }}
        >
          <Skeleton variant="circular" width={20} height={20} />
        </Box>

        <Paper elevation={3} sx={{ flex: 1, p: 1.5, borderRadius: "10px", ml: 1 }}>
          <Skeleton variant="text" width="60%" height={20} />
          <Skeleton variant="text" width="40%" height={14} />
          <Skeleton variant="text" width="50%" height={14} />
          <Skeleton variant="text" width="30%" height={14} />
        </Paper>
      </Box>
    ));

  return (
    <CommonDrawer open={open} onClose={onClose} anchor="right" width={600} title="G-Suite History">
      {/* Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 1.5, alignItems: "center" }}>
        <CommonFilter menuOptions={currencyOptions} value={currency} onChange={setCurrency} />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <CommonYearDatePicker
            label="Select Year"
            value={selectedYear ? new Date(selectedYear, 0) : ""}
            onChange={(date) => setSelectedYear(date ? date.getFullYear() : "")}
            views={["year"]}
            height={40}
          />
          {selectedYear && (
            <Box
              onClick={() => setSelectedYear("")}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 28,
                height: 28,
                borderRadius: "50%",
                backgroundColor: "grey.5",
                cursor: "pointer",
              }}
            >
              <IconButton>
                <ClearIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Transaction List */}
      <Box
        ref={scrollRef}
        onScroll={handleScroll}
        sx={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto", px: 1 }}
      >

        {isLoading && pageNo === 1 ? (
          renderSkeleton()
        ) : data.length ? (
          data.map((item) => {
            const d = new Date(item.start_date);
            const day = d.getDate().toString().padStart(2, "0");
            const month = d.toLocaleString("en-US", { month: "short" });
            const year = d.getFullYear();

            return (
              <Box
                key={item._id}
                sx={{ display: "flex", alignItems: "flex-start", mb: 2, position: "relative" }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    left: 70,
                    top: 32,
                    bottom: -5,
                    width: "1px",
                    background: "#D1D1DB",
                    zIndex: 1,
                  }}
                />
                {/* DATE BOX */}
                <Box sx={{ width: 40, textAlign: "center" }}>
                  <Typography variant="body1" sx={{ fontSize: 24, fontWeight: 700 }}>
                    {day}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontSize: 11 }}>
                    {month}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontSize: 11 }}>
                    {year}
                  </Typography>
                </Box>

                {/* ICON */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    backgroundColor: theme.palette.success.light,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: 1.5,
                  }}
                >
                  <GoogleIcon sx={{ fontSize: 20, color: theme.palette.success.main }} />
                </Box>

                <Paper
                  elevation={3}
                  sx={{
                    flex: 1,
                    p: 1.5,
                    borderRadius: "10px",
                    background: theme.palette.success.light,
                    borderLeft: `4px solid ${theme.palette.success.main}`,
                    ml: 1,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "scale(1.01)",
                      transition: "0.2s",
                    },
                  }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontWeight: 600 }}>{item?.subscription}</Typography>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Tooltip
                        arrow
                        placement="left"
                        componentsProps={{
                          tooltip: {
                            sx: { bgcolor: "#000", borderRadius: 2, boxShadow: 3, p: 1 },
                          },
                        }}
                        title={
                          <Box sx={{ p: 1 }}>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>Domain:</b> {item?.domain_name}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>Plan:</b> {item?.subscription}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>Description:</b> {item?.description}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>Interval:</b> {item?.interval} days
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>Order #:</b> {item?.order_name}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>Start:</b>{" "}
                              {new Date(item?.start_date).toLocaleDateString()}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.white" }}>
                              <b>End:</b> {new Date(item?.end_date).toLocaleDateString()}
                            </Typography>
                          </Box>
                        }
                      >
                        <InfoIcon sx={{ fontSize: 18, cursor: "pointer" }} />
                      </Tooltip>
                      <Typography variant="subtitle1" sx={{ fontSize: 12 }}>
                        {d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography sx={{ fontSize: 13, color: "#5B5B5B" }}>
                    Quantity : {item?.quantity}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#5B5B5B" }}>
                    Amount : ₹{item?.amount}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "#5B5B5B" }}>
                    Interval: {item?.interval} {item?.interval === 1 ? "day" : "days"}
                  </Typography>
                </Paper>
              </Box>
            );
          })
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography>No G-Suite transactions found for this domain.</Typography>
          </Box>
        )}

        {isLoading && pageNo > 1 &&
          <Box sx={{ display: "flex", justifyContent: "center", py: 2, ml: 10 }}>
            <FlowerLoader size={20} />
          </Box>
        }
      </Box>
    </CommonDrawer>
  );
};

export default GSuiteHistory;
