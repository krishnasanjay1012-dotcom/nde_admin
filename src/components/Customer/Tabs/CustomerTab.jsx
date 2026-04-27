import React, { useEffect } from "react";
import { useNavigate, useLocation, useParams, useSearchParams } from "react-router-dom";

import CommonTabs from "../../../components/common/NDE-Tabs";
import Overview from "../../Customer/Tabs/OverviewTab";
import Transactions from "./Cust-Transactions";
import Mails from "./Cust-Mails";
import Domain from "./Cust-Domain";
import Hosting from "./Cust-Hoisting";
import GSuite from "./Cust-G-Suite";
import CustomerUser from "./Cust-User";
import OverView from "./Cust-OverView";
import History from "./Cust-History";
import CustomerApp from "./Cust-App";
import Invoice from "./Cust-Innvoice";
import CustComments from "./Cust-Comments";
import Statement from "./Statement";



const CustomerTab = ({ selectedWorkspaceId, userId, customerData, isLoading }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { customerId } = useParams();
  const basePath = `/customers/details/${customerId}`;


  const queryString = searchParams.toString() ? `?${searchParams.toString()}` : "";

  const tabRoutes = [
    // { route: "overview", component: <Overview selectedWorkspaceId={selectedWorkspaceId} userId={userId} /> },
    { route: "overview", component: <OverView selectedWorkspaceId={selectedWorkspaceId} userId={userId} customerData={customerData} isLoading={isLoading} /> },
    { route: "domain", component: <Domain selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "hosting", component: <Hosting selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "g-suite", component: <GSuite selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "app", component: <CustomerApp selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "invoice", component: <Invoice selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "history", component: <History selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "comments", component: <CustComments userId={userId} selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "statements", component: <Statement userId={userId} selectedWorkspaceId={selectedWorkspaceId} /> },
    
    { route: "transactions", component: <Transactions selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "mails", component: <Mails selectedWorkspaceId={selectedWorkspaceId} /> },
    { route: "users", component: <CustomerUser selectedWorkspaceId={selectedWorkspaceId} /> },
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

export default CustomerTab;
