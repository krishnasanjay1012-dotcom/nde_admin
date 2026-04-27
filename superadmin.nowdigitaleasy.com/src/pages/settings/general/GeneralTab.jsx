import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";
import ClientLogo from "./ClientLogo";
import ImpLink from "./ImpLink";
import ConfigSettings from "./ConfigSettings";
import Currencies from "../finance/Currencies";
import AppDetails from "./App-Details";
import RecaptchaDetails from "./recaptcha-Details";

const GeneralTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = "/settings/general";

  const tabRoutes = [
    { route: "config-settings", component: <ConfigSettings /> },
    { route: "currencies", component: <Currencies /> },
    { route: "client-logo", component: <ClientLogo /> },
    { route: "imp-link", component: <ImpLink /> },
    // { route: "tag", component: <Tag /> },
    { route: "app", component: <AppDetails /> },
    { route: "recaptcha", component: <RecaptchaDetails /> },

  ];

  const tabs = tabRoutes?.map(({ route, component }) => ({
    route: `${basePath}/${route}`,
    label: route.charAt(0)?.toUpperCase() + route?.slice(1)?.replace("-", " "),
    component,
  }));

  useEffect(() => {
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate, tabs, basePath]);

  const currentTabFromUrl = tabs?.findIndex((tab) =>
    location?.pathname?.includes(tab.route)
  );
  const currentTab = currentTabFromUrl >= 0 ? currentTabFromUrl : 0;

  return (
    <Box>
      <CommonTabs tabs={tabs} currentTab={currentTab} mt={0} />
    </Box>
  );
};

export default GeneralTab;
