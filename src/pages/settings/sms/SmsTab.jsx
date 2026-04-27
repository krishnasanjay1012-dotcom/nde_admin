import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";

const SmsTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = "/settings/sms";

  const tabRoutes = [
    { route: "config", label: "SMS Config" },
    { route: "template", label: "SMS Template" },
  ];

  const tabs = tabRoutes.map(({ route, label }) => ({
    route: `${basePath}/${route}`,
    label,
  }));

  useEffect(() => {
    if (
      location.pathname === basePath ||
      location.pathname === `${basePath}/`
    ) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate]);

  const currentTabFromUrl = tabs.findIndex((tab) =>
    location.pathname.includes(tab.route)
  );
  const currentTab = currentTabFromUrl >= 0 ? currentTabFromUrl : 0;

  return (
    <Box>
      <CommonTabs tabs={tabs} currentTab={currentTab} mt={0} />
      <Outlet />
    </Box>
  );
};

export default SmsTab;
