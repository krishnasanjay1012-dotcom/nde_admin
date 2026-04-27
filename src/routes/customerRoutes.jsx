import React, { lazy } from "react";
import NewCustomer from "../pages/Customers/Cust-form/New-Cust-Create";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";

// Pages
const Customers = lazy(() => import("../pages/Customers/Customers"));
const NewCustomView = lazy(() => import("../components/common/NewCustomView"));

// Customer Components
const CustomerForm = lazy(
  () => import("../components/Customer/Customer-Create-Edit"),
);
const CustomerDetails = lazy(
  () => import("../components/Customer/Customer-Details"),
);

// Customer Tabs
const OverviewTab = lazy(
  () => import("../components/Customer/Tabs/Cust-OverView"),
);
const CommentsTab = lazy(
  () => import("../components/Customer/Tabs/Cust-History"),
);
const TransactionsTab = lazy(
  () => import("../components/Customer/Tabs/Cust-Transactions"),
);
const MailsTab = lazy(() => import("../components/Customer/Tabs/Cust-Mails"));
const StatementTab = lazy(
  () => import("../components/Customer/Tabs/StatementTab"),
);
const CustomerDomain = lazy(
  () => import("../components/Customer/Tabs/Cust-Domain"),
);
const CustomerHosting = lazy(
  () => import("../components/Customer/Tabs/Cust-Hoisting"),
);
const CustomerGSuite = lazy(
  () => import("../components/Customer/Tabs/Cust-G-Suite"),
);
const InvoiceTab = lazy(
  () => import("../components/Customer/Tabs/Cust-Innvoice"),
);
const CustomerAppTab = lazy(
  () => import("../components/Customer/Tabs/Cust-App"),
);
const History = lazy(() => import("../components/Customer/Tabs/Cust-History"));
const CustomerUser = lazy(
  () => import("../components/Customer/Tabs/Cust-User"),
);
import CustComments from "./../components/Customer/Tabs/Cust-Comments";
import Statement from "../components/Customer/Tabs/Statement";
import CommonSendEmail from "../components/common/NDE-Mail";
import NDEFileImport from "../components/common/NDE-FileImport";
import SendEmailCustomerWrapper from "../components/Customer/Email/SendEmail-Customer-Wrapper";

export const customerRoutes = [
  { path: "customers", element: <Customers /> },
  { path: ":module/new-custom-view", element: <NewCustomView /> },
  { path: ":module/edit/custom-view/:customId", element: <EditCustomView /> },
  { path: ":module/import", element: <NDEFileImport /> },
  { path: "customers/new", element: <NewCustomer /> },
  { path: "customers/:customerId/edit", element: <NewCustomer /> },
  { path: "customers/statement/email", element: <CommonSendEmail /> },
  { path: "customers/:customerId/statements/email", element: <SendEmailCustomerWrapper /> },

  {
    path: "customers/details/:customerId",
    element: <CustomerDetails />,
    children: [
      { path: "overview", element: <OverviewTab /> },
      { path: "history", element: <History /> },
      { path: "transactions", element: <TransactionsTab /> },
      { path: "mails", element: <MailsTab /> },
      { path: "statement", element: <StatementTab /> },
      { path: "hosting", element: <CustomerHosting /> },
      { path: "domain", element: <CustomerDomain /> },
      { path: "g-suite", element: <CustomerGSuite /> },
      { path: "app", component: <CustomerAppTab /> },
      { path: "invoice", component: <InvoiceTab /> },
      { path: "users", component: <CustomerUser /> },
      { path: "comments", component: <CustComments /> },
      { path: "statements", component: <Statement /> },
      { path: "", element: <OverviewTab /> },
    ],
  },
];
