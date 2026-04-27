import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams,useSearchParams } from "react-router-dom";
import SubOverviewTab from "./Sub-Overview";
import CommonTabs from "../../../common/NDE-Tabs";
import History from "../../../Customer/Tabs/Cust-History";

const SubscriptionTab = ({selectedSubscription}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { subscriptionId } = useParams();
  const basePath = `/sales/subscriptions/details/${subscriptionId}`;

    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";


  const tabRoutes = [
    { route: "overview", component: <SubOverviewTab selectedSubscription={selectedSubscription} /> },
    { route: "history", component: <History /> },
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

export default SubscriptionTab;
