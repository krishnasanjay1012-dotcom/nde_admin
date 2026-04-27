// import { lazy } from "react";
// import OrderCreateDetails from "../components/Order/Order-Create-Details";
// import OrderDetails from "../components/Order/Order-Details";
// import OrderDetailsOverView from "../pages/Order/Order-Deatils";
// import EditInvoice from "../pages/sales/invoice/Edit-Invoice";
// import CreateRecordPayment from "../pages/sales/invoice/CreateRecordPayment";
// import InvoiceRightPanelWrapper from "../components/Sales/Invoices/InvoiceRigtPanelWrapper";
// import NewInvoiceForm from "../components/Sales/Invoices/Create-Invoice";
// import SubscriptionList from "../components/Sales/Subscriptions/Subscription-List";
// import SendEmailWrapper from "../pages/sales/invoice/SendEmailWrappers";
// import CreateDebitNote from "../pages/sales/invoice/create-debit-note";
// import CloneInvoice from "../components/Sales/Invoices/Clone-Invoice";
// import EditCustomView from "../components/common/NDE-Edit-Custom-View";
// import NewCustomView from "../components/common/NewCustomView";
// import NDEFileImport from "../components/common/NDE-FileImport";
// import SubscriptionCreateEdit from "../components/Sales/Subscriptions/Subscription-Create-Edit";

// // Sales Pages
// const Invoice = lazy(() => import("../pages/sales/invoice/Invoice"));
// const Orders = lazy(() => import("../pages/Order/Orders"));

// // Sales Components
// const InvoiceDetails = lazy(
//   () => import("../components/Sales/Invoices/Invoice-Details"),
// );

// const SubscriptionDetails = lazy(
//   () => import("../components/Sales/Subscriptions/Subscription-Details"),
// );
// const SubOverviewTab = lazy(
//   () => import("../components/Sales/Subscriptions/tab/Sub-Overview"),
// );

// // Order Components
// const OrderForm = lazy(() => import("../components/Order/Order-Create"));

// const History = lazy(() => import("../components/Customer/Tabs/Cust-History"));

// export const salesRoutes = [
//   { path: "sales/order", element: <Orders /> },
//   { path: "sales/invoices", element: <Invoice /> },
//   { path: "sales/invoices/:invoiceId/email", element: <SendEmailWrapper /> },
//   {
//     path: "sales/invoices/details/:invoiceId",
//     element: <InvoiceDetails />,
//     children: [
//       {
//         index: true,
//         element: <InvoiceRightPanelWrapper />,
//       },
//       {
//         path: "payment",
//         element: <CreateRecordPayment />,
//       },
//     ],
//   },
//   // { path: "sales/invoices/edit/:invoiceId", element: <EditInvoice /> },
//   {
//     path: "sales/invoices/:invoiceId/debit-note",
//     element: <CreateDebitNote />,
//   },
//   {
//     path: "sales/invoices/edit/:invoiceId",
//     element: <NewInvoiceForm edit={true} />,
//   },

//   { path: "sales/invoices/new-invoice", element: <NewInvoiceForm /> },
//   { path: "sales/invoices/clone/:invoiceId", element: <CloneInvoice /> },

//   { path: "sales/subscriptions", element: <SubscriptionList /> },
//   { path: "sales/subscriptions/new", element: <SubscriptionCreateEdit /> },

//   // {path: "sales/orders/create", element: <OrderForm />},
//   { path: "sales/orders/create", element: <OrderCreateDetails /> },

//   {
//     path: "sales/subscriptions/details/:subscriptionId",
//     element: <SubscriptionDetails />,
//     children: [
//       { path: "overview", element: <SubOverviewTab /> },
//       { path: "history", element: <History /> },
//       { path: "", element: <SubOverviewTab /> },
//     ],
//   },

//   {
//     path: "sales/orders/details/:orderId",
//     element: <OrderDetails />,
//     children: [{ path: "overview", element: <OrderDetailsOverView /> }],
//   },

//   {
//     path: "sales/:module/edit/custom-view/:customId",
//     element: <EditCustomView />,
//   },
//   { path: "sales/:module/new-custom-view", element: <NewCustomView /> },
//   { path: "sales/:module/import", element: <NDEFileImport /> },

// ]; 


import { lazy } from "react";

// Order Components
import OrderCreateDetails from "../components/Order/Order-Create-Details";
import OrderDetails from "../components/Order/Order-Details";
import OrderDetailsOverView from "../pages/Order/Order-Deatils";

// Invoice Components
import CreateRecordPayment from "../pages/sales/invoice/CreateRecordPayment";
import InvoiceRightPanelWrapper from "../components/Sales/Invoices/InvoiceRigtPanelWrapper";
import NewInvoiceForm from "../components/Sales/Invoices/Create-Invoice";
import SendEmailWrapper from "../pages/sales/invoice/SendEmailWrappers";
import CreateDebitNote from "../pages/sales/invoice/create-debit-note";
import CloneInvoice from "../components/Sales/Invoices/Clone-Invoice";

// Subscription Components
import SubscriptionList from "../components/Sales/Subscriptions/Subscription-List";
import SubscriptionCreateEdit from "../components/Sales/Subscriptions/Subscription-Create-Edit";

// Common Components
import EditCustomView from "../components/common/NDE-Edit-Custom-View";
import NewCustomView from "../components/common/NewCustomView";
import NDEFileImport from "../components/common/NDE-FileImport";

// Lazy Pages
const Invoice = lazy(() => import("../pages/sales/invoice/Invoice"));
const Orders = lazy(() => import("../pages/Order/Orders"));

const InvoiceDetails = lazy(() =>
  import("../components/Sales/Invoices/Invoice-Details")
);

const SubscriptionDetails = lazy(() =>
  import("../components/Sales/Subscriptions/Subscription-Details")
);

const SubOverviewTab = lazy(() =>
  import("../components/Sales/Subscriptions/tab/Sub-Overview")
);

const History = lazy(() =>
  import("../components/Customer/Tabs/Cust-History")
);

export const salesRoutes = [
  // ---------------- ORDERS ----------------
  { path: "sales/orders", element: <Orders /> },

  { path: "sales/orders/create", element: <OrderCreateDetails /> },

  { path: "sales/orders/edit/:orderId", element: <OrderCreateDetails edit /> },

  {
    path: "sales/orders/details/:orderId",
    element: <OrderDetails />,
    children: [
      {
        index: true,
        element: <OrderDetailsOverView />,
      },
      {
        path: "overview",
        element: <OrderDetailsOverView />,
      },
      {
        path: "history",
        element: <History />,
      },
    ],
  },

  // ---------------- INVOICES ----------------
  { path: "sales/invoices", element: <Invoice /> },

  { path: "sales/invoices/new-invoice", element: <NewInvoiceForm /> },

  {
    path: "sales/invoices/edit/:invoiceId",
    element: <NewInvoiceForm edit={true} />,
  },

  { path: "sales/invoices/clone/:invoiceId", element: <CloneInvoice /> },

  {
    path: "sales/invoices/:invoiceId/debit-note",
    element: <CreateDebitNote />,
  },

  { path: "sales/invoices/:invoiceId/email", element: <SendEmailWrapper /> },

  {
    path: "sales/invoices/details/:invoiceId",
    element: <InvoiceDetails />,
    children: [
      {
        index: true,
        element: <InvoiceRightPanelWrapper />,
      },
      {
        path: "payment",
        element: <CreateRecordPayment />,
      },
    ],
  },

  // ---------------- SUBSCRIPTIONS ----------------
  { path: "sales/subscriptions", element: <SubscriptionList /> },

  { path: "sales/subscriptions/new", element: <SubscriptionCreateEdit /> },

  {
    path: "sales/subscriptions/details/:subscriptionId",
    element: <SubscriptionDetails />,
    children: [
      { index: true, element: <SubOverviewTab /> },
      { path: "overview", element: <SubOverviewTab /> },
      { path: "history", element: <History /> },
    ],
  },

  // ---------------- COMMON ----------------
  {
    path: "sales/:module/edit/custom-view/:customId",
    element: <EditCustomView />,
  },

  {
    path: "sales/:module/new-custom-view",
    element: <NewCustomView />,
  },

  {
    path: "sales/:module/import",
    element: <NDEFileImport />,
  },
];