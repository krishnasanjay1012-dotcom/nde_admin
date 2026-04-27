
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CommonTabs from "../../../components/common/NDE-Tabs";
import { Box } from "@mui/material";
import Gsuite from "./Gsuite";
import Domain from "./Domain";
import Plesk from "./Plesk";
import Razorpay from "./Razorpay";
import S3config from "./s3-config";
import DomainTLD from "./Domain-Tld-List";



const IntegrationTab = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const basePath = "/settings/integration";

  const tabRoutes = [
    { route: "gsuite", label: "Gsuite", component: <Gsuite /> },
    { route: "domain", label: "Domain", component: <Domain /> },
    { route: "plesk", label: "Plesk", component: <Plesk /> },
    { route: "razorpay", label: "Razorpay", component: <Razorpay /> },
    { route: "s3-config", label: "S3 Config", component: <S3config /> },
    { route: "domain-config", label: "Domain Config", component: <DomainTLD /> },
  ];

  const tabs = tabRoutes.map(({ route, label, component }) => ({
    route: `${basePath}/${route}`,
    label,
    component,
  }));

  useEffect(() => {
    if (location.pathname === basePath || location.pathname === `${basePath}/`) {
      navigate(tabs[0].route, { replace: true });
    }
  }, [location.pathname, navigate]);

  const currentTabFromUrl = tabs.findIndex(
    (tab) => location.pathname === tab.route
  );

  const currentTab = currentTabFromUrl >= 0 ? currentTabFromUrl : 0;

  return (
    <Box>
      <CommonTabs tabs={tabs} currentTab={currentTab} mt={0} />
    </Box>
  );
};

export default IntegrationTab;
