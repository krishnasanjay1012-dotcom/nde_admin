import { lazy } from "react";
import CreatePayment from "../pages/Payment/Payment-Create-Edit";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";
import NewCustomView from "../components/common/NewCustomView";
import PaymentRefund from "../components/Payments/PaymentRecieved/components/PaymentRefund";

const PaymentList = lazy(() => import("../components/Payments/PaymentRecieved/PaymentList"));
const PaymentDetails = lazy(() => import("../components/Payments/PaymentRecieved/PaymentDetails"));
const GSuiteTransactions = lazy(() => import("../components/Payments/G-Suite-Transactions/g-suite-tansactions"));


export const paymentRoutes = [
  { path: "sales/payments", element: <PaymentList /> },
  { path: "sales/payments/new", element: <CreatePayment /> },
  { path: "sales/payments/edit/:paymentId", element: <CreatePayment /> },
  {
    path: "sales/payments/details/:paymentId", element: <PaymentDetails />,
    children: [
      {
        path: "paymentrefund",
        element: <PaymentRefund />,
      }
    ]
  },
  { path: "g-suite-transactions", element: <GSuiteTransactions /> },
  { path: "sales/:module/edit/custom-view/:customId", element: <EditCustomView /> },
  { path: "sales/:module/new-custom-view", element: <NewCustomView /> },
];
