import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";
import InvoiceDetails from "../../../components/Sales/invoice/Invoice-Details";

const InvoiceTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabRoutes = [
    { route: "invoice-Details", component: <InvoiceDetails /> },
  ];

  const tabs = tabRoutes.map(({ route, component }) => ({
    route,
    label: route.charAt(0).toUpperCase() + route.slice(1).replace("-", " "),
    component,
  }));

  useEffect(() => {
    const basePath = "/sales/invoices";
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(`${basePath}/${tabs[0].route}`, { replace: true });
    }
  }, [location.pathname, navigate, tabs]);

  const currentTabFromUrl = tabs.findIndex((tab) =>
    location.pathname.includes(tab.route)
  );
  const currentTab = currentTabFromUrl >= 0 ? currentTabFromUrl : 0;

  return (
    <CommonTabs
      tabs={tabs}
      currentTab={currentTab}
      backRoute="/sales/invoices"   
    />
  );
};

export default InvoiceTab;
