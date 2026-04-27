import { lazy } from "react";
import Products from "../components/Product/Product-List";
import ProductDetails from "../components/Product/Product-Details";
import PlanCreateFormProvider from "../components/Product/Product-Plan-New";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";
import NewCustomView from "../components/common/NewCustomView";

// Product Pages
const NewItemForm = lazy(() => import("../pages/Product/item/Create-Item"));
const Items = lazy(() => import("../pages/Product/item/Items"));
const ApplicationList = lazy(() => import("../pages/Applications/ApplicationList"));

// Product Components
const ItemDetails = lazy(() => import("../components/Product/item/ItemDetails"));
const ItemHistory = lazy(() => import("../components/Product/item/HistroyDetails"));
const ItemTransaction = lazy(() => import("../components/Product/item/ItemTransaction"));

// Applications Components
const SuiteComponent = lazy(() => import("../components/Applications/SuitePortion/SuiteDetails"));
const SuitesTab = lazy(() => import("../components/Applications/SuitePortion/SuitesTab"));
const ApplicationDetails = lazy(() => import("../components/Applications/ApplicationPortion/ApplicationDetails"));
const ApplicationTab = lazy(() => import("../components/Applications/ApplicationPortion/ApplicationTab"));


export const productRoutes = [
  { path: "item", element: <Items /> },
  { path: "products/item/create", element: <NewItemForm /> },
  {
    path: "products/item/details",
    element: <ItemDetails />,
    children: [
      { path: "transactions", element: <ItemTransaction /> },
      { path: "history", element: <ItemHistory /> },
    ],
  },
  {
    path: "products/applications",
    element: <ApplicationTab />,
    children: [
      { path: "application", element: <ApplicationList /> },
      { path: "suite", element: <SuitesTab /> },
      { path: "", element: <ApplicationList /> },
    ],
  },
  { path: "products/applications/suite-details", element: <SuiteComponent /> },
  { path: "products/applications/application-details", element: <ApplicationDetails /> },
  { path: "products", element: <Products /> },
  { path: ":module/edit/custom-view/:customId", element: <EditCustomView /> },
  { path: ":module/new-custom-view", element: <NewCustomView /> },
  {
    path: "products/details/:productId",
    element: <ProductDetails />,
    children: [
      {
        path: "create/plan",
        element: <PlanCreateFormProvider />,
      },
      {
        path: "edit/plan/:planId",
        element: <PlanCreateFormProvider />,
      },
    ],
  }

];
