import React, { useMemo } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Link,
  Skeleton,
  Button,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useCharts } from "../../hooks/dashboard/dashboard";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <Box
        sx={{
          backgroundColor: "primary.contrastText",
          p: 1,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 1,
        }}
      >
        <Typography variant="body2">{`${name}: ${value}`}</Typography>
      </Box>
    );
  }
  return null;
};

const TotalService = () => {
  const { data: chartData, isLoading } = useCharts();
  const navigate = useNavigate();

  const data = useMemo(() => {
    if (!chartData) return [];

    return [
      {
        label: "Not due yet",
        quantity: chartData.totalnotdue || 0,
        amount: `₹${(chartData.totalnotdue * 1000).toLocaleString()}`,
        value: chartData.totalnotdue || 0,
        color: "#1A73E8",
        route: "/report/total-service?page=1&limit=10&filter=not-due-report&sort=",
      },
      {
        label: "Due soon",
        quantity: chartData.totalduesoon || 0,
        amount: `₹${(chartData.totalduesoon * 1000).toLocaleString()}`,
        value: chartData.totalduesoon || 0,
        color: "#00BCD4",
        route: "/report/total-service?page=1&limit=10&filter=due-soon-report&sort=",
      },
      {
        label: "Overdue",
        quantity: chartData.totaloverdue || 0,
        amount: `₹${(chartData.totaloverdue * 1000).toLocaleString()}`,
        value: chartData.totaloverdue || 0,
        color: "#FFC107",
        route: "/report/total-service?page=1&limit=10&filter=expired&sort=",
      },
      {
        label: "At risk",
        quantity: chartData.totalrisk || 0,
        amount: `₹${(chartData.totalrisk * 1000).toLocaleString()}`,
        value: chartData.totalrisk || 0,
        color: "#FF7043",
        route: "/report/total-service?page=1&limit=10&filter=risk-report&sort=",
      },
      {
        label: "Suspended",
        quantity: chartData.totalsuspended || 0,
        amount: `₹${(chartData.totalsuspended * 1000).toLocaleString()}`,
        value: chartData.totalsuspended || 0,
        color: "#E53935",
        route: "/report/total-service?page=1&limit=10&filter=suspended&sort=",
      },
    ];
  }, [chartData]);

  const handleNavigate = (row) => {
    if (row.route) {
      navigate(row.route);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        // p: 2,
        mx: "auto",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Total Service
      </Typography>

      {/* Pie Chart */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 250 }}>
          <Skeleton variant="circular" width={200} height={200} />
        </Box>
      ) : (
        <Box sx={{ width: "100%", height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                startAngle={90}
                endAngle={-270}
                labelLine={{ stroke: "#8A8AA3", strokeWidth: 1 }}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      )}

      {/* Table */}
      {isLoading ? (
        <Box sx={{ flex: 1 }}>
          {[...Array(5)].map((_, idx) => (
            <Skeleton key={idx} variant="text" width="100%" height={40} sx={{ mb: 1, borderRadius: 1 }} />
          ))}
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowX: "auto" }}>
          <Table size="small" sx={{ minWidth: 350 }}>
            <TableBody>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>INVOICE STATUS</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>QUANTITY</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: "14px" }}>AMOUNT DUE</TableCell>
                <TableCell />
              </TableRow>

              {data.map((row) => (
                <TableRow key={row.label}>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: "50%", backgroundColor: row.color }} />
                      <Typography sx={{ fontSize: "14px" }}>{row.label}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>{row.quantity}</TableCell>
                  <TableCell sx={{ fontSize: "14px" }}>{row.amount}</TableCell>
                  <TableCell>
                    <Button
                      sx={{
                        fontSize: "14px",
                        color: row.quantity === 0 ? "text.disabled" : "primary.main",
                        cursor: "pointer",
                        fontWeight: 700,
                        height: 30
                      }}
                      onClick={() => handleNavigate(row)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}
    </Box>
  );
};

export default TotalService;
