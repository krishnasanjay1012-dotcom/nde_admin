import { lazy } from "react";
import NewCustomView from "../components/common/NewCustomView";
import NDEFileImport from "../components/common/NDE-FileImport";
import EditCustomView from "../components/common/NDE-Edit-Custom-View";
import VendorOverview from "../components/Purchased/vendor/VendorTab/VendorOverview";
import VendorComments from "../components/Purchased/vendor/VendorTab/VendorComments";
import NewVendor from "../components/Purchased/vendor/NewVendor";
import VendorDetails from "../components/Purchased/vendor/Vendor-Details";
import BillDetails from "../components/Purchased/Bills/Bills-Details";
import BillPaymentForm from "../components/Purchased/Bills/BillPaymentForm";
import BillsCalendarView from "../components/Purchased/Bills/BillsCalendarView";
import VendorStatement from "../components/Purchased/vendor/VendorTab/Vendor-Statement";
import VendorMail from "../components/Purchased/vendor/VendorTab/Vendor-Mail";
import PaymentMadeList from "../components/Purchased/PaymentMade/PaymentMadeList";
import PaymentMadeNew from "../components/Purchased/PaymentMade/PaymentMade-New";

const Bills = lazy(() => import("../pages/Purchased/Bills"));
const Vendor = lazy(() => import("../pages/Purchased/Vendor"));

const NewBillsForm = lazy(
  () => import("../components/Purchased/Bills/Bill-Form/Create-bills"),
);

export const purchasedRoutes = [
  // List pages
  { path: "purchased/vendors", element: <Vendor /> },
  { path: "purchased/bills", element: <Bills /> },
  { path: "purchased/bills/new", element: <NewBillsForm /> },
  {
    path: "purchased/bills/:billId/edit",
    element: <NewBillsForm edit={true} />,
  },
  { path: "purchased/bills/calendar", element: <BillsCalendarView /> },
  { path: "purchased/vendors/new", element: <NewVendor /> },
  { path: "purchased/vendors/:vendorId/edit", element: <NewVendor /> },

  { path: "purchased/:module/new-custom-view", element: <NewCustomView /> },
  {
    path: "purchased/:module/edit/custom-view/:customId",
    element: <EditCustomView />,
  },
  { path: "purchased/:module/import", element: <NDEFileImport /> },
  { path: "purchased/vendors/:vendorId/statements/email", element: <VendorMail /> },


  // Details pages (FIXED)

  {
    path: "purchased/vendors/details/:vendorId",
    element: <VendorDetails />,
    children: [
      { index: true, element: <VendorOverview /> },
      { path: "overview", element: <VendorOverview /> },
      { path: "comments", element: <VendorComments /> },
      { path: "statement", element: <VendorStatement /> },
    ],
  },

  {
    path: "purchased/bills/details/:billId",
    element: <BillDetails />,
    children: [{ path: "payment", element: <BillPaymentForm /> }],
  },


  // Payments

  { path: "purchased/payments", element: <PaymentMadeList /> },
  { path: "purchased/payments/new", element: <PaymentMadeNew /> },

];
