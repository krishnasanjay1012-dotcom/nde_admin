import React, { lazy, useEffect, useMemo } from "react";
import { Box } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";
import PaymentTerms from "./Payment-config";
import TaxList from "./Manage-tds&tcs";
import GstTaxes from "./Tax-settings";

const TransactionSettings = lazy(() =>
  import("../transaction-series/SeriesSettingsWrapper")
);

const ConfiguratonTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = "/settings/configuration";

  const tabRoutes = useMemo(
    () => [
      { route: "transaction-series", component: <TransactionSettings /> },
      { route: "payment-terms", component: <PaymentTerms /> },
      { route: "manage-tax", component: <TaxList /> },
      { route: "gst-taxes", component: <GstTaxes /> },

    ],
    []
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
    [tabRoutes]
  );

  useEffect(() => {
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate, tabs]);

  const currentTab =
    tabs.findIndex((tab) => location.pathname.startsWith(tab.route)) ?? 0;

  return (
    <Box>
      <CommonTabs tabs={tabs} currentTab={currentTab < 0 ? 0 : currentTab} mt={0} />
    </Box>
  );
};

export default ConfiguratonTab;