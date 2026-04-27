import React, { useState } from "react";
import { Tabs, Tab, Box, useMediaQuery, useTheme } from "@mui/material";
import CommonBackButton from "../../components/common/NDE-BackButton";

const CommonTabs = ({ tabs, backRoute, mt = 2, onTabChange }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleChange = (event, newValue) => {
    setCurrentTab(newValue);
    if (onTabChange) onTabChange(newValue);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          flexWrap: "wrap",
        }}
      >
        {backRoute && (
          <Box sx={{ mr: 2 }}>
            <CommonBackButton to={backRoute} />
          </Box>
        )}

        <Tabs
          value={currentTab}
          onChange={handleChange}
          variant={isSmallScreen ? "scrollable" : "standard"}
          scrollButtons={isSmallScreen ? "auto" : "off"}
          allowScrollButtonsMobile
          TabIndicatorProps={{
            children: <span className="MuiTabs-indicatorSpan" />,
          }}
          sx={{
            flex: 1,
            "& .MuiTab-root": {
              textTransform: "none",
              color: "grey.6",
              fontWeight: 400,
              "&.Mui-selected": { color: "primary.main" },
            },
            "& .MuiTabs-indicator": {
              display: "flex",
              justifyContent: "center",
              backgroundColor: "transparent",
              mb: 1
            },
            "& .MuiTabs-indicatorSpan": {
              maxWidth: 40,
              width: "100%",
              backgroundColor: "primary.main",
              borderRadius: "3px",
            },
          }}
        >
          {tabs.map((tab, index) => (
            <Tab key={index} label={tab.label} disableRipple />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ mt: mt }}>
        {tabs[currentTab]?.component}
      </Box>
    </Box>
  );
};

export default CommonTabs;
