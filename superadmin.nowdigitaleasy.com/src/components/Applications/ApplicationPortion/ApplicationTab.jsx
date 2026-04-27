import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";
import SuitesTab from "../SuitePortion/SuitesTab";
import ApplicationList from "../../../pages/Applications/ApplicationList";

const ApplicationTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = "/products/applications";

  const tabRoutes = [
    { route: "application", component: <ApplicationList /> },
    { route: "suite", component: <SuitesTab /> },
  ];

  const tabs = tabRoutes.map(({ route, component }) => ({
    route: `${basePath}/${route}`,
    label: route.charAt(0).toUpperCase() + route.slice(1),
    component,
  }));

  useEffect(() => {
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate, tabs, basePath]);

  const currentTabFromUrl = tabs.findIndex((tab) =>
    location.pathname.includes(tab.route)
  );
  const currentTab = currentTabFromUrl >= 0 ? currentTabFromUrl : 0;

  return (
    <Box>
      <CommonTabs tabs={tabs} currentTab={currentTab} mt={0}/>
    </Box>
  );
};

export default ApplicationTab;
