import TrendingDownRounded from "@mui/icons-material/TrendingDownRounded";
import TrendingUpRounded from "@mui/icons-material/TrendingUpRounded";
import {
  alpha,
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
} from "@mui/material";
import { useDashboardKPICard } from "../../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../../DashboardLoader";
import NoDataDashboard from "../../DashboardNoData";
import OpenDetailView from "../../DetailView/OpenDetailView";

const GrowthIndex = ({ id, data, disableDetails }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: growthData, isFetching } = useDashboardKPICard({ id });

  // ✅ Decide source
  const source = id ? growthData?.data : data;

  // ✅ Safe values
  const percent = source?.growth;
  const current = source?.currentValue;
  const prev = source?.previousValue;
  const label = source?.comparisonLabel;
  const title = source?.name;
  const metricLabel = source?.metric?.label;

  const percentageValue =
    percent !== undefined && percent !== null
      ? String(percent).includes("%")
        ? percent
        : `${percent}%`
      : null;

  // 🎨 Colors
  const isPositive = source?.comparison?.objective === "positive";

  const valueIsPositive = percent >= 0;
  const showPositive = isPositive === valueIsPositive;

  const percentColor = showPositive
    ? theme.palette.success.main
    : theme.palette.error.main;

  const bgTint = showPositive
    ? alpha(theme.palette.success.main, 0.08)
    : alpha(theme.palette.error.main, 0.08);

  const Icon = showPositive ? TrendingUpRounded : TrendingDownRounded;

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
        "&:hover": {
          borderColor: "primary.main",
        },
      }}
    >
      <CardContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {/* 🔹 Title */}
        <OpenDetailView
          data={source}
          title={title}
          disableDetails={disableDetails}
          label={metricLabel}
        />

        {/* 🔹 Loader */}
        {id && isFetching ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <AnalyticsLoader size={3} />
          </Box>
        ) : source ? (
          <>
            {/* 🔹 Main Row */}
            <Box display="flex" alignItems="center" gap={1.5}>
              {/* Percentage */}
              {percentageValue && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    px: 1,
                    py: 0.3,
                    borderRadius: 1.5,
                    backgroundColor: bgTint,
                  }}
                >
                  <Icon sx={{ fontSize: 16, color: percentColor }} />
                  <Typography
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: percentColor,
                    }}
                  >
                    {percentageValue}
                  </Typography>
                </Box>
              )}

              {/* Value */}
              {current !== undefined && (
                <Typography
                  sx={{
                    fontSize: "1.8rem",
                    fontWeight: 500,
                    color: theme.palette.text.primary,
                  }}
                >
                  {current}
                </Typography>
              )}
            </Box>

            {/* 🔹 Footer */}
            {(label || prev !== undefined) && (
              <Typography
                sx={{
                  fontSize: "0.8rem",
                  color: theme.palette.text.secondary,
                  fontWeight: 500,
                }}
              >
                {label && `${label}: `}
                {prev ?? ""}
              </Typography>
            )}
          </>
        ) : (
          <Box sx={{ mt: -2 }}>
            <NoDataDashboard size={80} />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default GrowthIndex;
