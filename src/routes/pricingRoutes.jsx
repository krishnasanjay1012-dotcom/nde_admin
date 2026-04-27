import { lazy } from "react";
import HostingDetails from "../components/Pricing/Hosting/Hosting-Details";

// Pricing Pages
const DomainPricing = lazy(() => import("../pages/Pricing/Domain/Domain"));
const Tax = lazy(() => import("../pages/Pricing/Tax/Tax"));
const GSuitePrice = lazy(() => import("../pages/Pricing/G-Suite Price/G-Suite"));

// Pricing Components
const GsuitePriceDetails = lazy(() => import("../components/Pricing/G-Suite Price/G-Suite-Details"));
const HostingPrice = lazy(() => import("../components/Pricing/Hosting/Hosting-Price"));
const EditHostingPlan = lazy(() => import("../components/Pricing/Hosting/Edit-hosting-plan"));
const HostingPaymentList = lazy(() => import("../components/Pricing/Hosting/Payment-List"));
const CreateProduct = lazy(() => import("../components/Pricing/Hosting/Create-Product"));


export const pricingRoutes = [
  { path: "domain", element: <DomainPricing /> },
  { path: "pricing/tax", element: <Tax /> },
  { path: "pricing/g-suite", element: <GSuitePrice /> },
  { path: "pricing/g-suite/details/:id", element: <GsuitePriceDetails /> },
  { path: "pricing/hosting", element: <HostingPrice /> },
  { path: "pricing/hosting/new", element: <CreateProduct /> },
  // { path: "pricing/hosting/:hostingId", element: <EditHostingPlan /> },
  { path: "pricing/hosting/:hostingId", element: <HostingDetails /> },
  // { path: "pricing/hosting/Pricing/:productName/:id", element: <HostingPaymentList /> }

];
