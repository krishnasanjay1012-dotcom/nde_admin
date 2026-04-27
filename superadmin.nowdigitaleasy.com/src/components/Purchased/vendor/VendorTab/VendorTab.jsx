import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";
import CommonTabs from "../../../common/NDE-Tabs";
import VendorOverview from './VendorOverview';
import VendorComments from "./VendorComments";
import VendorStatement from "./Vendor-Statement";

const VendorTab = ({ selectedVendor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { vendorId } = useParams();
  const basePath = `/purchased/vendors/details/${vendorId}`;

  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const tabRoutes = [
    { route: "overview", component: <VendorOverview selectedVendor={selectedVendor} /> },
    { route: "comments", component: <VendorComments selectedVendor={selectedVendor} /> },
    { route: "statement", component: <VendorStatement selectedVendor={selectedVendor} /> },
  ];

  const tabs = tabRoutes.map(({ route, component }) => ({
    route: `${basePath}/${route}${queryString}`,
    label: route.charAt(0).toUpperCase() + route.slice(1).replace("-", " "),
    component,
  }));

  useEffect(() => {
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate, tabs, basePath]);

  const currentTabIndex = tabs.findIndex(tab =>
    location.pathname.startsWith(tab.route.split("?")[0])
  );

  const currentTab = currentTabIndex >= 0 ? currentTabIndex : 0;

  return <CommonTabs tabs={tabs} currentTab={currentTab} mt={0} />;
};

export default VendorTab;