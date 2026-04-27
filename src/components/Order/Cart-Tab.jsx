import React from "react";
import CommonTabs from "../common/NDE-No-Route-Tab";
import CartList from "./Cart-list";

const OrderCartTab = ({ adminCart = []}) => {  

  const domainProducts = (adminCart || []).filter(item => item.product === "domain");
  const hostingProducts = (adminCart || []).filter(item => item.product === "hosting");
  const appsProducts = (adminCart || []).filter(item => item.product === "apps");
  const googleWorkspaceProducts = (adminCart || []).filter(item => item.product === "gsuite");


  const tabRoutes = [
    { label: "Domain", component: <CartList adminCart={domainProducts}  /> },
    { label:'Hosting', component: <CartList adminCart={hostingProducts} />},
    { label:'Google Workspace', component: <CartList adminCart={googleWorkspaceProducts} />},
    { label: "Apps", component: <CartList adminCart={appsProducts} /> },
  ];

  return <CommonTabs tabs={tabRoutes} mt={0} />;
};

export default OrderCartTab;
