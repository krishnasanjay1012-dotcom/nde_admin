import {
  alpha,
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { useDashboardKPICard } from "../../../../../hooks/global-dashboard/global-dashboard";
import { AnalyticsLoader } from "../../DashboardLoader";
import NoDataDashboard from "../../DashboardNoData";
import OpenDetailView from "../../DetailView/OpenDetailView";

const ScoreCard = ({ data = {}, disableDetails, id }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  // ✅ API only when id exists
  const { data: scoreData, isFetching } = useDashboardKPICard({ id });

  // ✅ Single source
  const source = id ? scoreData?.data : data;

  const items = source?.items?.length ? source?.items : data?.items;

  const comparisonLabel = source?.comparisonLabel;
  const isPositiveBase =
    source?.comparison?.objective === "positive"
      ? true
      : source?.comparison?.objective === "negative"
        ? false
        : true;

  return (
    <Card
      elevation={0}
      sx={{
        minWidth: 330,
        height: 300,

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
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* 🔹 Title */}
        <OpenDetailView disableDetails={disableDetails} data={source} />

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
        ) : items?.length ? (
          <>
            {/* 🔹 List */}
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                height: 0,
                overflowY: "auto",
                width: "100%",

                /* Keep scrollbar width ALWAYS */
                "&::-webkit-scrollbar": {
                  width: 6,
                },

                "&::-webkit-scrollbar-track": {
                  background: "transparent",
                },

                /* 🔴 Invisible by default */
                "&::-webkit-scrollbar-thumb": {
                  background: "transparent",
                  borderRadius: 3,
                },

                /* 🟢 Visible on hover */
                "&:hover::-webkit-scrollbar-thumb": {
                  background: alpha(theme.palette.text.primary, 0.4),
                },

                /* Firefox */
                scrollbarWidth: "thin",
                scrollbarColor: "transparent transparent",

                "&:hover": {
                  scrollbarColor: `${alpha(theme.palette.text.primary, 0.5)} transparent`,
                },
              }}
            >
              {items.map((item, index) => {
                const percent = item?.growth;
                const valueIsPositive = Number(percent) >= 0;
                const showPositive = isPositiveBase === valueIsPositive;

                const chipColor = showPositive
                  ? theme.palette.success.main
                  : theme.palette.error.main;

                const chipBg = showPositive
                  ? alpha(theme.palette.success.main, 0.12)
                  : alpha(theme.palette.error.main, 0.12);

                const percentageValue =
                  percent !== undefined
                    ? String(percent).includes("%")
                      ? percent
                      : `${percent}%`
                    : null;

                return (
                  <Box key={index}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      py={1.2}
                    >
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                        }}
                      >
                        {item.label}
                      </Typography>

                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: theme.palette.text.primary,
                            minWidth: 30,
                            textAlign: "right",
                          }}
                        >
                          {item.currentValue}
                        </Typography>

                        {percentageValue && (
                          <Box
                            sx={{
                              px: 1,
                              py: 0.3,
                              borderRadius: 1,
                              backgroundColor: chipBg,
                              minWidth: 60,
                              mr: 0.5,
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              sx={{
                                fontSize: "0.8rem",
                                fontWeight: 600,
                                color: chipColor,
                              }}
                            >
                              {percentageValue}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>

                    {/* Divider */}
                    {index !== items.length - 1 && (
                      <Divider
                        sx={{
                          borderColor: alpha(theme.palette.divider, 0.6),
                        }}
                      />
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* 🔹 Footer */}
            {comparisonLabel && (
              <Typography
                sx={{
                  mt: -1,
                  fontSize: "0.75rem",
                  color: theme.palette.text.secondary,
                  mb: -1,
                }}
              >
                *{comparisonLabel ? `Compared with ${comparisonLabel}` : ""}
              </Typography>
            )}
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <NoDataDashboard />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreCard;
