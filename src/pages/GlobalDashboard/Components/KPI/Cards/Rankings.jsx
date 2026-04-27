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

const Rankings = ({ data, disableDetails, id }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { data: rankData, isFetching } = useDashboardKPICard({ id });

  // ✅ Single source
  const source = id ? rankData?.data : data;

  const items = source?.items?.length ? source.items : data?.items;

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
          gap: 1,
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
          /* 🔹 List */
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
              const rank = index + 1;

              return (
                <Box key={index}>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    py={1.2}
                  >
                    {/* Left */}
                    <Box display="flex" alignItems="center" gap={1.2}>
                      <Typography
                        sx={{
                          fontSize: "0.85rem",
                          fontWeight: 500,
                          color: theme.palette.text.secondary,
                          minWidth: 18,
                        }}
                      >
                        {rank}.
                      </Typography>

                      <Typography
                        noWrap
                        sx={{
                          fontSize: "13px",
                          color: theme.palette.text.primary,
                          maxWidth: 160,
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>

                    {/* Right */}
                    <Typography
                      sx={{
                        fontSize: "13px",
                        color: theme.palette.text.primary,
                        textAlign: "right",
                        mr: 0.5,
                      }}
                    >
                      {item.value}
                    </Typography>
                  </Box>

                  {/* ✅ Correct divider */}
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
        ) : (
          /* 🔹 No Data */
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

export default Rankings;
