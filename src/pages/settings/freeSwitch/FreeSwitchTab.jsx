import React, { lazy, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";
import Domains from "./Domains";
import Extension from "./Extension";
import FreeSwitch from "./FreeSwitch";
import Gateway from "./Gateway";
import LoadBalancer from "./LoadBalancer";
import VirtualNumber from "./VirtualNumber/VirtualNumber";
import DialPlan from "./DialPlan";
import Groups from "./Groups";

// const TransactionSettings = lazy(() =>
//   import("../transaction-series/SeriesSettingsWrapper")
// );

const FreeSwitchTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = "/settings/freeSwitch";

  const tabRoutes = useMemo(
    () => [
      { route: "load-balancer", component: <LoadBalancer /> },
      { route: "free-switch", component: <FreeSwitch /> },
      { route: "domain", component: <Domains /> },
      { route: "extension", component: <Extension /> },
      { route: "gateway", component: <Gateway /> },
      { route: "groups", component: <Groups /> },
      { route: "dial-plan", component: <DialPlan /> },
      { route: "virtual-number", component: <VirtualNumber /> },
    ],
    [],
  );

  const tabs = useMemo(
    () =>
      tabRoutes.map(({ route, component }) => ({
        route: `${basePath}/${route}`,
        label: route
          .replace(/-/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        component,
      })),
    [tabRoutes],
  );

  useEffect(() => {
    if (
      location.pathname === basePath ||
      location.pathname === `${basePath}/`
    ) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate, tabs]);

  const currentTab =
    tabs.findIndex((tab) => location.pathname.startsWith(tab.route)) ?? 0;

  return (
    <Box>
      <CommonTabs
        tabs={tabs}
        currentTab={currentTab < 0 ? 0 : currentTab}
        mt={0}
      />
    </Box>
  );
};

export default FreeSwitchTab;
