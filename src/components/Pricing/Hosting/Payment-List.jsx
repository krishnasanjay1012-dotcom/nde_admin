import React, { useState } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getUserSession } from "../../../utils/session";
import HostingPayment from "./Hosting-Payment";
import WaveLoader from "../../common/NDE-WaveLoader";
import CommonButton from "../../common/NDE-Button";
import UpgradePlan from "../Hosting/UpgradePlan";

const api_url1 = "https://api.nowdigitaleasy.com/ndeadmin/v2";

function HostingPaymentList({onClose , productName}) {
  const { hostingId } = useParams();
  const { token } = getUserSession();

  const axiosConfig = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  const [recurring, setRecurring] = useState({});
  const [currencies, setCurrencies] = useState([]);
  const [openUpgradeDialog, setOpenUpgradeDialog] = useState(false);

  const fetchData = async () => {
    const response = await axios.get(`${api_url1}/product/getProduct/${hostingId}`, axiosConfig);

    const data = response.data.data;
    const recurringPricing = data?.pricing?.recurring || {};
    setRecurring(recurringPricing);
    const currencyList = recurringPricing.currency || [];
    setCurrencies(currencyList);
    return data;
  };

  const { data: tabsData, isLoading, isFetching } = useQuery({
    queryKey: ["tabsDataLoadd", hostingId],
    queryFn: fetchData,
    refetchOnWindowFocus: false,
  });

  const loading = isLoading || isFetching;

  return (
    <Box>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: { xs: "wrap", sm: "nowrap" },
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            {/* <IconButton
              onClick={() => navigate(-1)}
              sx={{
                border: "1px solid #E5E7EB",
                "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
              }}
            >
              <ArrowBackIcon />
            </IconButton> */}
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              Payment Configuration
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: "text.secondary" }}>
            Manage recurring payment settings and currency pricing
          </Typography>
        </Box>

        <Box sx={{ mt: { xs: 1, sm: 0 } }}>
          <CommonButton
            variant="contained"
            onClick={() => setOpenUpgradeDialog(true)}
            label="Upgrade Plan"
          />
        </Box>
      </Box>
      <Box>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <WaveLoader size={60} barCount={6} />
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              Loading payment configuration...
            </Typography>
          </Box>
        ) : (
          <HostingPayment
            currencies={currencies}
            setCurrencies={setCurrencies}
            recurring={recurring}
            productId={hostingId}
            axiosConfig={axiosConfig}
            onClose={onClose}
          />
        )}
      </Box>

      {/* Upgrade Dialog */}
      {tabsData && (
        <UpgradePlan
          open={openUpgradeDialog}
          onClose={() => setOpenUpgradeDialog(false)}
          productId={hostingId}
          upgraded={tabsData}
          axiosConfig={axiosConfig}
          productName={productName}
        />
      )}
    </Box>
  );
}

export default HostingPaymentList;
