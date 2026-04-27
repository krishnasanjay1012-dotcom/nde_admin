import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  alpha,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PaymentIcon from "@mui/icons-material/Payment";
import WarningIcon from "@mui/icons-material/Warning";
import LanguageIcon from "@mui/icons-material/Language";
import StorageIcon from "@mui/icons-material/Storage";
import AppsIcon from "@mui/icons-material/Apps";
import { useNavigate } from "react-router-dom";

import YearlySalesReport from "../../components/DashBoard/Yearly-Sales-Report";
import DailyPerformance from "../../components/DashBoard/Daily Performance";
import TotalService from "../../components/DashBoard/Total-Service";
import ProductReport from "../../components/DashBoard/Product-Report";

import {
  useTotalDomain,
  useTotalClients,
  useUserCount,
  useOrderCount,
  useTotalGsuite,
  useTotalHosting,
  useTotalPaidInvoice,
  useTotalSales,
  useOverdueCount,
} from "../../hooks/dashboard/dashboard";

export default function DashboardCard({ dateRange, currency }) {
  const navigate = useNavigate();

  const { data: totalClientsResponse } = useTotalClients({ range: dateRange });
  const totalClients = totalClientsResponse?.totalCount || 0;

  const { data: usersResponse } = useUserCount({ range: dateRange });
  const users = usersResponse?.totalCount || 0;

  const { data: ordersResponse } = useOrderCount({ range: dateRange });
  const orders = ordersResponse?.totalCount || 0;

  const { data: salesResponse } = useTotalSales({ range: dateRange });
  const inrSales =
    salesResponse?.find((sale) => sale._id === currency)?.totalAmount || 0;
  const formattedSales = inrSales.toLocaleString("en", {
    style: "currency",
    currency: currency,
  });

  const { data: paidInvoicesResponse } = useTotalPaidInvoice({
    range: dateRange,
  });
  const paidInvoices = paidInvoicesResponse?.totalCount || 0;

  const { data: overDueResponse } = useOverdueCount({ range: dateRange });
  const overDue = overDueResponse?.totalCount || 0;

  const { data: domainsResponse } = useTotalDomain({ range: dateRange });
  const domains = domainsResponse?.totalDocuments || 0;

  const { data: hostingResponse } = useTotalHosting({ range: dateRange });
  const hosting = hostingResponse?.totalDocuments || 0;

  const { data: gSuitesResponse } = useTotalGsuite({ range: dateRange });
  const gSuites = gSuitesResponse?.totalSeats || 0;

  const cardData = [
    {
      title: "Total Clients",
      value: totalClients,
      icon: <PeopleIcon sx={{ color: "icon.light" }} />,
      route: "/customers",
    },
    {
      title: "Total Users",
      value: users,
      icon: <TrendingUpIcon sx={{ color: "icon.light" }} />,
      route:
        "/customers?page=1&limit=10&filter=all-user&search=&sort=&start_date=&end_date=",
    },
    {
      title: "Total Orders",
      value: orders,
      icon: <ShoppingCartIcon sx={{ color: "icon.light" }} />,
      route:
        "/sales/order?page=1&limit=10&searchTerm=&filter=success&date_filter=all&sort=",
    },
    {
      title: "Total Sales",
      value: formattedSales,
      icon: null,
      currency: (
        <Typography
          variant="h2"
          sx={{
            display: "inline-block",
            textAlign: "center",
            width: 40,
            fontFamily: "monospace",
          }}
        >
          {"$"}
        </Typography>
      ),
      route: "/sales",
    },
    {
      title: "Paid Invoices",
      value: paidInvoices,
      icon: <PaymentIcon sx={{ color: "icon.light" }} />,
      route: "/sales/invoices?page=1&limit=10&filter=paid&search=&sort=",
    },
    {
      title: "OverDue",
      value: overDue,
      icon: <WarningIcon sx={{ color: "icon.light" }} />,
      route: "/report/overdue",
    },
    {
      title: "Total Domains",
      value: domains,
      icon: <LanguageIcon sx={{ color: "icon.light" }} />,
      route: "/report/domain",
    },
    {
      title: "Total Hosting",
      value: hosting,
      icon: <StorageIcon sx={{ color: "icon.light" }} />,
      route: "/report/hosting",
    },
    {
      title: "Total G-Suites",
      value: gSuites,
      icon: <AppsIcon sx={{ color: "icon.light" }} />,
      route: "/report/g-suite",
    },
  ];

  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const pastelStyles = [
    {
      bg: isDark ? alpha("#27AE60", 0.15) : "#EAFBF2",
      iconBg: isDark ? alpha("#27AE60", 0.3) : "#C9F1D9",
      iconColor: isDark ? "#2ECC71" : "#14804A",
    },
    {
      bg: isDark ? alpha("#AB47BC", 0.15) : "#F3E5F5",
      iconBg: isDark ? alpha("#AB47BC", 0.3) : "#E1BEE7",
      iconColor: isDark ? "#CE93D8" : "#7B1FA2",
    },
    {
      bg: isDark ? alpha("#4752EB", 0.15) : "#F1F2FD",
      iconBg: isDark ? alpha("#4752EB", 0.3) : "#DADCFB",
      iconColor: isDark ? "#7D82FF" : "#2330E7",
    },
    {
      bg: isDark ? alpha("#F9A825", 0.15) : "#FFF8E6",
      iconBg: isDark ? alpha("#F9A825", 0.3) : "#FFE4A3",
      iconColor: isDark ? "#FBC02D" : "#F9A825",
    },
    {
      bg: isDark ? alpha("#1E88E5", 0.15) : "#E8F4FF",
      iconBg: isDark ? alpha("#1E88E5", 0.3) : "#CCE4FF",
      iconColor: isDark ? "#64B5F6" : "#1E88E5",
    },
    {
      bg: isDark ? alpha("#E74C3C", 0.15) : "#FFF0F0",
      iconBg: isDark ? alpha("#E74C3C", 0.3) : "#FFD6D6",
      iconColor: isDark ? "#E74C3C" : "#EB5757",
    },
    {
      bg: isDark ? alpha("#5C6BC0", 0.15) : "#F3F7FF",
      iconBg: isDark ? alpha("#5C6BC0", 0.3) : "#DEE8FF",
      iconColor: isDark ? "#7986CB" : "#3949AB",
    },
    {
      bg: isDark ? alpha("#00897B", 0.15) : "#F4FDFB",
      iconBg: isDark ? alpha("#00897B", 0.3) : "#D2F5EE",
      iconColor: isDark ? "#4DB6AC" : "#00897B",
    },
    {
      bg: isDark ? alpha("#6D4C41", 0.15) : "#EFEBE9",
      iconBg: isDark ? alpha("#6D4C41", 0.3) : "#D7CCC8",
      iconColor: isDark ? "#A1887F" : "#4E342E",
    },
  ];

  return (
    <Box
      sx={{
        flexGrow: 1,
        overflowY: "auto",
        overflowX: "hidden",
        maxHeight: "calc(100vh - 166px)",
      }}
    >
      {/* Top Stat Cards */}
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          mt: 0.5,
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
        }}
      >
        {cardData.map((card, index) => {
          const style = pastelStyles[index % pastelStyles.length];

          return (
            <Card
              key={index}
              onClick={() => navigate(card.route)}
              sx={{
                backgroundColor: style.bg,
                borderRadius: 3,
                cursor: "pointer",
                height: 74,
                transition: "all 0.3s ease",
                boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
                },
              }}
            >
              <CardContent
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                {/* Icon */}
                {card?.icon && (
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      bgcolor: style.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {React.cloneElement(card?.icon, {
                      sx: { color: style.iconColor, fontSize: 24 },
                    })}
                  </Box>
                )}
                {/* currency */}
                {card?.currency && (
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      bgcolor: style.iconBg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: style.iconColor,
                    }}
                  >
                    {card?.currency}
                  </Box>
                )}

                {/* Text */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      fontSize: 16,
                      mb: 0.5,
                    }}
                  >
                    {card.value}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: 12,
                      fontWeight: 500,
                      color: "text.secondary",
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {/* Total Service & Yearly Report */}
      <Box
        mt={2}
        sx={{
          backgroundColor: "background.default",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: "10px",
          px: 2,
          py: 2,
        }}
      >
        <Box
          display="grid"
          gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
          gap={2}
        >
          <Card
            sx={{
              borderRadius: "16px",
              backgroundColor: "background.paper",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <TotalService />
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: "16px",
              backgroundColor: "background.paper",
              boxShadow: "none",
            }}
          >
            <CardContent>
              <YearlySalesReport />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Daily Performance */}
      <Box
        mt={2}
        sx={{
          backgroundColor: "background.default",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: "10px",
          px: 2,
          py: 2,
        }}
      >
        <Card
          sx={{
            borderRadius: "16px",
            backgroundColor: "background.paper",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ alignItems: "center", height: "100%" }}>
            <DailyPerformance />
          </CardContent>
        </Card>
      </Box>

      {/* Product Report */}
      <Box
        mt={2}
        sx={{
          backgroundColor: "background.default",
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: "10px",
          px: 2,
          py: 2,
        }}
      >
        <Card
          sx={{
            borderRadius: "16px",
            backgroundColor: "background.paper",
            boxShadow: "none",
          }}
        >
          <CardContent sx={{ alignItems: "center", height: "100%" }}>
            <ProductReport />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
