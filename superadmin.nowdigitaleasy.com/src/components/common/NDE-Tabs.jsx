import { Tabs, Tab, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CommonBackButton from "../../components/common/NDE-BackButton";

const CommonTabs = ({ tabs, currentTab, backRoute, mt = 2 }) => {
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    navigate(tabs[newValue].route);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #E0E0E0",
          flexWrap: "nowrap",
        }}
      >
        {backRoute && (
          <Box sx={{ mr: 2, flexShrink: 0 }}>
            <CommonBackButton to={backRoute} />
          </Box>
        )}

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Tabs
            value={currentTab}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            TabIndicatorProps={{
              children: <span className="MuiTabs-indicatorSpan" />,
            }}
            sx={{
              "& .MuiTabs-root": {
                minHeight: 42,
              },
              "& .MuiTabs-flexContainer": {
                flexWrap: "nowrap",
                padding: 0,
              },
              "& .MuiTabs-scroller": {
                padding: 0,
              },
              "& .MuiTab-root": {
                textTransform: "none",
                color: "grey.6",
                fontWeight: 400,
                whiteSpace: "nowrap",
                minWidth: 0,
                px: 2,
                minHeight: 42,

                "&.Mui-selected": {
                  color: "primary.main",
                  fontWeight: 500,
                },
              },

              "& .MuiTabs-scrollButtons.Mui-disabled": {
                width: 0,
                opacity: 0,
              },

              "& .MuiTabs-indicator": {
                display: "flex",
                justifyContent: "center",
                backgroundColor: "transparent",
              },
              "& .MuiTabs-indicatorSpan": {
                maxWidth: 40,
                width: "100%",
                backgroundColor: "primary.main",
                borderRadius: "3px",
                ml: 1,
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} disableRipple />
            ))}
          </Tabs>
        </Box>
      </Box>

      <Box sx={{ mt: mt, width: "100%" }}>{tabs[currentTab]?.component}</Box>
    </Box>
  );
};

export default CommonTabs;
