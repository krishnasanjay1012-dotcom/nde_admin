import { Box, Card, Typography, useTheme } from "@mui/material";
import { useDashboardKPICard } from "../../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../../DashboardLoader";
import NoDataDashboard from "../../DashboardNoData";
import OpenDetailView from "../../DetailView/OpenDetailView";

const Basics = ({ data, disableDetails, id }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: basicData, isFetching } = useDashboardKPICard({ id });

  const source = id ? basicData?.data : data;

  const value = source?.currentValue;

  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 330,
        height: 140,

        display: "flex",
        flexDirection: "column",
        borderRadius: 2,

        ...(!id
          ? {}
          : {
              backgroundColor: isDark
                ? "background.default"
                : "background.paper",
            }),

        border: "1px solid",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
        borderColor: "divider",
        "& .MuiCardContent-root:last-child": {
          p: 2,
        },
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        {/* 🔹 Title */}
        <OpenDetailView disableDetails={disableDetails} data={source} />

        {/* 🔹 Value */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexGrow={1}
        >
          {id && isFetching ? (
            <AnalyticsLoader size={3} />
          ) : value !== undefined ? (
            <Typography
              sx={{
                fontSize: "30px",
                fontWeight: 500,
                color: theme.palette.text.primary,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {value}
            </Typography>
          ) : (
            <Box sx={{ mt: -2 }}>
              <NoDataDashboard size={80} />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  );
};

export default Basics;
