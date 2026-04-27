import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Checkbox,
  useTheme,
  Divider,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import PaymentIcon from "@mui/icons-material/Payment";
import ReceiptIcon from "@mui/icons-material/Receipt";
import CommonDialog from "./NDE-Dialog";
import {
  useDomainRenewalPrice,
  usePayDomainRenewal,
  usePaymentGsuiteProduct,
  useRenewalPleskProduct,
  useRenewGsuitePayment,
  useRenewPleskPayment,
} from "../../hooks/renewal-price/renewal-price-hooks";
import { CommonSelect } from "./fields";
import FlowerLoader from "./NDE-loader";
import DomainImg from "../../assets/image/domain.svg";
import HostingImg from "../../assets/image/hosting.svg";
import WorkspaceImg from "../../assets/image/google-workspace.svg";




export default function DomainRenewal({
  open,
  onClose,
  productId,
  userId,
  selectedProduct,
}) {
  const theme = useTheme();
  const payDomainRenewal = usePayDomainRenewal();
  const payGsuiteRenewal = useRenewGsuitePayment();
  const payPleskRenewal = useRenewPleskPayment();

  // console.log(selectedProduct, 'selectedProduct');


  const isGSuite =
    selectedProduct?.productName?.toLowerCase() === "gsuite" ||
    selectedProduct?.product?.toLowerCase() === "gsuite";

  const isPlesk =
    selectedProduct?.productName?.toLowerCase() === "plesk" ||
    selectedProduct?.product?.toLowerCase() === "plesk";

  const isDomain =
    selectedProduct?.productName?.toLowerCase() === "domain" ||
    selectedProduct?.product?.toLowerCase() === "domain";


  const { data: domainData } = useDomainRenewalPrice(productId, userId, isDomain);
  const { data: gsuiteData } = usePaymentGsuiteProduct(selectedProduct?._id, userId, isGSuite);
  const { data: pleskData } = useRenewalPleskProduct(selectedProduct?._id, userId, isPlesk);

  const normalizeData = () => {
    if (isDomain && domainData) {
      return {
        mappedData: domainData.mappedData.map((x) => ({
          label: `${x.year} year${x.year > 1 ? "s" : ""}`,
          value: x.year,
          price: x.price,
          Tax: x.Tax,
          total: x.total,
        })),
        walletBalance: domainData.walletBalance || 0,
      };
    }

    if (isGSuite && gsuiteData) {
      return {
        mappedData: gsuiteData.plans.map((x) => ({
          label: x.planName,
          value: x.planName,
          price: x.defaultPrice || 0,
          Tax: 0,
          total: x.defaultPrice || 0,
        })),
        walletBalance: gsuiteData.walletBalance || 0,
      };
    }

    if (isPlesk && pleskData) {
      const priceMap = pleskData.priceDetails?.allprices || {};
      const normalized = Object.entries(priceMap).map(([key, val]) => ({
        label: key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()),
        value: key,
        price: val,
        Tax: 0,
        total: val,
      }));

      return {
        mappedData: normalized,
        walletBalance: pleskData.walletBalance || 0,
      };
    }

    return { mappedData: [], walletBalance: 0 };
  };

  const normalized = normalizeData();

  const [selectedDuration, setSelectedDuration] = useState("");
  const [priceDetails, setPriceDetails] = useState({
    subtotal: 0,
    tax: 0,
    total: 0,
  });
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [walletChecked, setWalletChecked] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);


  useEffect(() => {
    if (normalized.mappedData?.length > 0) {
      const first = normalized.mappedData[0];
      setSelectedDuration(first.value);
      setPriceDetails({
        subtotal: first.price ?? 0,
        tax: first.Tax ?? 0,
        total: first.total ?? 0,
      });
    }
  }, [domainData, gsuiteData, pleskData]);


  const handleDurationChange = (event) => {
    const value = event.target.value;
    setSelectedDuration(value);
    const selectedItem = normalized.mappedData.find((x) => x.value === value);
    if (selectedItem) {
      setPriceDetails({
        subtotal: selectedItem.price ?? 0,
        tax: selectedItem.Tax ?? 0,
        total: selectedItem.total ?? 0,
      });
    }
  };

  const handleSubmit = () => {
    onClose();
    setPaymentOpen(true);
  };

  const handlePay = () => {
    if (!selectedProduct) return;

    const basePayload = {
      id: selectedProduct._id,
      isWallet: walletChecked,
      clientId: userId,
      workspaceId: selectedProduct.workspaceId,
    };

    let payload;

    if (isGSuite) {
      payload = {
        ...basePayload,
        planName: selectedDuration,
      };
    } else {
      payload = {
        ...basePayload,
        period: selectedDuration,
      };
    }

    let mutationFn;

    if (isDomain) {
      mutationFn = payDomainRenewal;
    } else if (isGSuite) {
      mutationFn = payGsuiteRenewal;
    } else if (isPlesk) {
      mutationFn = payPleskRenewal;
    }

    if (!mutationFn) {
      console.error("No valid payment type found!");
      return;
    }

    mutationFn.mutate(payload, {
      onSuccess: (res) => {
        // console.log("Payment successful:", res);
        setPaymentOpen(false);
        onClose();
      },
      onError: (err) => {
        console.error("Payment failed:", err);
      },
    });
  };



  const tabData = [
    { title: "Netbanking", icon: <AccountBalanceIcon fontSize="large" /> },
    { title: "UPI", icon: <PaymentIcon fontSize="large" /> },
    { title: "Debit Card", icon: <CreditCardIcon fontSize="large" /> },
    { title: "Credit Card", icon: <CreditCardIcon fontSize="large" /> },
    { title: "Wallets", icon: <AccountBalanceWalletIcon fontSize="large" /> },
    { title: "Cheque", icon: <ReceiptIcon fontSize="large" /> },
  ];

 const getImageByTitle = (title) => {
  switch (title) {
    case "Domain Renewal":
      return DomainImg;
    case "Plesk Renewal":
      return HostingImg;
    case "G-Suite Renewal":
      return WorkspaceImg;
    default:
      return DomainImg;
  }
};

  const dialogTitle = isDomain
    ? "Domain Renewal"
    : isPlesk
      ? "Plesk Renewal"
      : isGSuite
        ? "G-Suite Renewal"
        : "Renewal";

  const imageSrc = getImageByTitle(dialogTitle);



  return (
    <>
      <CommonDialog
        open={open}
        title={dialogTitle}
        onClose={onClose}
        submitLabel="Proceed"
        onSubmit={handleSubmit}
        
      >
        <Box>
          {/* Confirmation Message */}
          <Box
            sx={{
              backgroundColor: theme.palette.warning.light,
              color: theme.palette.text.primary,
              p: 1.5,
              borderRadius: 2,
              mb: 2,
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            Are You Sure You Want To Confirm The Renewal For{" "}
            <Typography
              component="span"
              sx={{
                color: theme.palette.primary.main,
                fontStyle: "italic",
                display: "inline-block",
                maxWidth: "150px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                verticalAlign: "bottom",
              }}
              title={selectedProduct?.domainName || selectedProduct?.productName || "example.com"}
            >
              {selectedProduct?.domainName ||
                selectedProduct?.productName ||
                "example.com"}
            </Typography>

          </Box>

          {/* Domain/GSuite/Plesk Details */}
          <Paper
            elevation={0}
            sx={{
              border: `1px solid ${theme.palette.grey[300]}`,
              p: 2,
              mb: 3,
              width: "100%",
            }}
          >
            <Box
              display="flex"
              flexWrap="nowrap"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1.5}
                flexShrink={0}
                minWidth="200px"
              >
                <img
                  src={imageSrc}
                  alt={dialogTitle}
                  width={38}
                  height={38}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}
                    sx={{
                      display: "inline-block",
                      maxWidth: "150px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      verticalAlign: "bottom",
                    }}
                    title={selectedProduct?.domainName || selectedProduct?.productName || "Product"}
                  >
                    {selectedProduct?.domainName ||
                      selectedProduct?.productName ||
                      "Product"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={theme.palette.text.secondary}
                  >
                    {dialogTitle}
                  </Typography>
                </Box>
              </Box>

              <Box ml={1}>
                <CommonSelect
                  label={"Duration"}
                  options={normalized.mappedData}
                  value={selectedDuration}
                  onChange={handleDurationChange}
                  mb={0}
                  mt={0.5}
                  width="200px"
                />
              </Box>

              <Box flexShrink={0} minWidth="120px" ml={2}>
                <Typography variant="subtitle2" fontWeight={600} mb={0.5}>
                  Renewal Cost
                </Typography>
                <Typography variant="body1">
                  ₹{priceDetails.subtotal.toLocaleString("en-IN")}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Price Summary */}
          <Box
            sx={{
              border: `1px solid ${theme.palette.grey[300]}`,
              borderRadius: 2,
              p: 2,
              ml: "auto",
              mt: 1,
              width: { xs: "100%", sm: 350 },
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Subtotal</Typography>
              <Typography>
                ₹{priceDetails.subtotal.toLocaleString("en-IN")}
              </Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography>Tax</Typography>
              <Typography>
                ₹{priceDetails.tax.toLocaleString("en-IN")}
              </Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box display="flex" justifyContent="space-between">
              <Typography fontWeight={600}>Total</Typography>
              <Typography fontWeight={700}>
                ₹{priceDetails.total.toLocaleString("en-IN")}
              </Typography>
            </Box>
          </Box>
        </Box>
      </CommonDialog>

      {/* STEP 2: Payment */}
      <CommonDialog
        open={paymentOpen}
        title="Renewal Payment"
        onClose={() => setPaymentOpen(false)}
        onSubmit={handlePay}
        submitDisabled={
          (isDomain && payDomainRenewal.isPending) ||
            (isGSuite && payGsuiteRenewal.isPending) ||
            (isPlesk && payPleskRenewal.isPending) ? (
            <FlowerLoader color="white" size={10} />
          ) : (
            "Pay Now"
          )
        }
      >
        {/* Payment Summary */}
        <Box
          sx={{
            width: "100%",
            p: 2,
            borderRadius: 2,
            border: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <Stack direction="row" justifyContent="space-between">
            <Typography color={theme.palette.text.secondary}>
              You Are Paying For One Order Request
            </Typography>
            <Typography fontWeight={600}>
              ₹{priceDetails.total.toLocaleString("en-IN")}
            </Typography>
          </Stack>
        </Box>

        {/* Wallet Section */}
        <Box
          sx={{
            width: "100%",
            p: 2,
            borderRadius: 2,
            bgcolor: theme.palette.background.paper,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography color={theme.palette.text.secondary}>
            Pay Via My Balance
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Checkbox
              checked={walletChecked}
              onChange={(e) => setWalletChecked(e.target.checked)}
              disabled={normalized.walletBalance < priceDetails.total}
              sx={{ padding: 0 }}
            />
            <Typography>
              <strong>My Balance:</strong> ₹
              {normalized.walletBalance.toLocaleString("en-IN")}
            </Typography>
          </Stack>
        </Box>

        {/* Payment Methods */}
        <Typography sx={{ mt: 2, mb: 1 }}>Payment Method</Typography>
        <Box sx={{ display: "flex", overflowX: "auto", py: 1 }}>
          {tabData.map((tab, idx) => (
            <Box
              key={idx}
              onClick={() => setSelectedTab(idx)}
              sx={{
                flex: "0 0 100px",
                m: 0.5,
                p: 1,
                borderRadius: 2,
                cursor: "pointer",
                textAlign: "center",
                boxShadow:
                  selectedTab === idx
                    ? `0px 0px 6px ${theme.palette.blue[400]}`
                    : "0px 3px 8px rgba(0,0,0,0.05)",
                transform: selectedTab === idx ? "scale(1.05)" : "scale(1)",
                transition: "all 0.3s",
                bgcolor:
                  selectedTab === idx
                    ? theme.palette.primary.extraLight
                    : theme.palette.background.default,
              }}
            >
              {tab.icon}
              <Typography fontSize="0.9rem">{tab.title}</Typography>
            </Box>
          ))}
        </Box>
      </CommonDialog>
    </>
  );
}
