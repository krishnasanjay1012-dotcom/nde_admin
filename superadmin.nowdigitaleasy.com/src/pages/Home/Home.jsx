import { Box, Typography, useMediaQuery } from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import CommonDateRangeDropdown from "../../components/common/fields/NDE-DateRangeDropdown";
import { useState } from "react";
import DashboardCard from "../Dashboard/Dashboard-Card";
import { keyframes } from "@emotion/react";
import { getUserSession } from "../../utils/session";
import { useTheme } from "@mui/material/styles";
import bgImage from "../../assets/image/dasbord-bg.svg";
import { SpaceDashboard } from "@mui/icons-material";

const wave = keyframes`
  0% { transform: rotate(0deg); }
  15% { transform: rotate(14deg); }
  30% { transform: rotate(-8deg); }
  40% { transform: rotate(14deg); }
  50% { transform: rotate(-4deg); }
  60% { transform: rotate(10deg); }
  100% { transform: rotate(0deg); }
`;

const Home = () => {
  const [dateRange, setDateRange] = useState("last_12_months");
  const [currency, setCurrency] = useState("INR");
  const { username, role } = getUserSession();

  const options = [
    { label: "Last 3 Months", value: "last_3_months" },
    { label: "Last 12 Months", value: "last_12_months" },
    { label: "This Quarter", value: "this_quarter" },
    { label: "Previous Quarter", value: "previous_quarter" },
    { label: "This Year", value: "this_year" },
    { label: "Previous Year", value: "previous_year" },
    { label: "Year to Date", value: "year_to_date" },
  ];

  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          p: 2,
          pb: 0,
          backgroundImage: (theme) =>
            theme.palette.mode === "dark" ? "none" : `url(${bgImage})`,
        }}
      >
        {/* Left Side: Icon + Text */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {/* Icon Box */}
          <Box
            sx={{
              border: (theme) => `2px solid ${theme.palette.divider}`,
              mr: 1,
              display: "flex",
              alignContent: "center",
              borderRadius: 2,
              p: 0,
            }}
          >
            <SpaceDashboard fontSize={isSmall ? "medium" : "large"} />
          </Box>

          {/* Text Section */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              variant={isSmall ? "h5" : "h4"}
              // sx={{ display: "flex", alignItems: "center" }}
            >
              Dashboard
              {/* <Box
                component="span"
                sx={{
                  display: "inline-block",
                  animation: `${wave} 2s ease-in-out 1`,
                  transformOrigin: "70% 70%",
                  mr: 1,
                }}
              >
                👋
              </Box>
              Hello,{" "}
              {username
                ? username.charAt(0).toUpperCase() + username.slice(1)
                : "User"} */}
            </Typography>

            {/* <Typography
              variant="body2"
              fontSize={isSmall ? 14 : 16}
              ml={isSmall ? 0 : 3.5}
              mt={0.5}
            >
              {role
                ? role.charAt(0).toUpperCase() +
                  role.slice(1)?.replaceAll("_", " ")
                : "Role"}
            </Typography> */}
          </Box>
        </Box>

        {/* Right Side: Dropdown */}
        <Box
          sx={{ ml: { xs: 0, sm: "auto" }, width: { xs: "100%", sm: "auto" } }}
        >
          <CommonDateRangeDropdown
            options={options}
            value={dateRange}
            onChange={setDateRange}
            label="Date Range"
            sx={{ width: 240 }}
            fullWidth={isSmall} // dropdown full width on mobile
          />
        </Box>
      </Box>

      <Box sx={{ p: 2 }}>
        <DashboardCard currency={currency} dateRange={dateRange} />
      </Box>
    </>
  );
};

export default Home;
