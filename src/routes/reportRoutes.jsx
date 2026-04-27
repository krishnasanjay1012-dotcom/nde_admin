import { lazy } from "react";
import NewCustomView from "../components/common/NewCustomView";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";

// Report Components
const RenewalReport = lazy(() => import("../components/Report/Renewal-Report"));

// Report Pages
const GsuiteList = lazy(() => import("../pages/reports/Gsuite-ProductList"));
const DomainList = lazy(() => import("../pages/reports/Domain-ProductList"));
const HostingList = lazy(() => import("../pages/reports/Hosting-ProductList"));
const TotalServiceList = lazy(() => import("../pages/reports/Total-ServiceList"));
const Overdue = lazy(() => import("../pages/reports/Overdue-ProductList"));
const AppList = lazy(() => import("../pages/reports/App-ProductList"));


export const reportRoutes = [
  { path: "report/total-service", element: <TotalServiceList /> },
  { path: "report/renewal", element: <RenewalReport /> },
  { path: "report/g-suite", element: <GsuiteList /> },
  { path: "report/domain", element: <DomainList /> },
  { path: "report/hosting", element: <HostingList /> },
  { path: "report/overdue", element: <Overdue /> },
  { path: "report/purchasedProduct", element: <AppList /> },

  { path: "report/:module/new-custom-view", element: <NewCustomView /> },
  { path: "report/:module/edit/custom-view/:customId", element: <EditCustomView /> },

];
