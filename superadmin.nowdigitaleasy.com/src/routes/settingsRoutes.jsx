import { lazy } from "react";
import S3config from "../pages/settings/integrations/s3-config";
import DomainTLD from "../pages/settings/integrations/Domain-Tld-List";
import AdminList from "../components/auth/AdminList";
import ConfiguratonTab from "../pages/settings/cofiguration/configurationTab";
import PaymentTerms from "../pages/settings/cofiguration/Payment-config";
import TaxList from "../pages/settings/cofiguration/Manage-tds&tcs";
import GstTaxes from "../pages/settings/cofiguration/Tax-settings";
import DialPlan from "../pages/settings/freeSwitch/DialPlan";

import VirtualNumber from "../pages/settings/freeSwitch/VirtualNumber/VirtualNumber";
import VirtualNumberDetail from "../pages/settings/freeSwitch/VirtualNumber/VirtualNumberDetail";
import BulkAssign from "../pages/settings/freeSwitch/VirtualNumber/BulkAssign";
import IVRFlowBuilder from "../pages/settings/freeSwitch/IVRFlowBuilder";

// Integrations
const Gsuite = lazy(() => import("../pages/settings/integrations/Gsuite"));
const Domain = lazy(() => import("../pages/settings/integrations/Domain"));
const Plesk = lazy(() => import("../pages/settings/integrations/Plesk"));
const Razorpay = lazy(() => import("../pages/settings/integrations/Razorpay"));
const IntegrationTab = lazy(
  () => import("../pages/settings/integrations/IntegrationTab"),
);

// Communication
const Email = lazy(() => import("../pages/settings/communication/Email"));
const EmailTemplate = lazy(
  () => import("../pages/settings/communication/EmailTemplate"),
);
const BulkEmail = lazy(
  () => import("../pages/settings/communication/BulkEmail"),
);
const EmailReport = lazy(
  () => import("../pages/settings/communication/Email-Report"),
);
const EmailTab = lazy(() => import("../pages/settings/communication/EmailTab"));

// SMS
const SmsTemplate = lazy(() => import("../pages/settings/sms/SmsTemplate"));
const TransactionSettings = lazy(
  () => import("../pages/settings/transaction-series/SeriesSettingsWrapper"),
);

const EditTemplate = lazy(
  () => import("../pages/settings/communication/Edit-Template"),
);

// Finance
const Currencies = lazy(() => import("../pages/settings/finance/Currencies"));

// General Settings
const ConfigSettings = lazy(
  () => import("../pages/settings/general/ConfigSettings"),
);
const ClientLogo = lazy(() => import("../pages/settings/general/ClientLogo"));
const ImpLink = lazy(() => import("../pages/settings/general/ImpLink"));
const Tag = lazy(() => import("../pages/settings/general/Tag"));
const GeneralTab = lazy(() => import("../pages/settings/general/GeneralTab"));
const AppDetails = lazy(() => import("../pages/settings/general/App-Details"));
const RecaptchaDetails = lazy(
  () => import("../pages/settings/general/recaptcha-Details"),
);

// Template Setting
const TemplatePage = lazy(
  () => import("../pages/settings/templateDns/TemplatePage"),
);
const CreateTemplate = lazy(
  () => import("../pages/settings/templateDns/TemplateFormPage"),
);
const EditTemplatedns = lazy(
  () => import("../pages/settings/templateDns/TemplateFormPage"),
);
// FreeSwitch
const LoadBalancer = lazy(
  () => import("../pages/settings/freeSwitch/LoadBalancer"),
);
const FreeSwitchTab = lazy(
  () => import("../pages/settings/freeSwitch/FreeSwitchTab"),
);
const FreeSwitch = lazy(
  () => import("../pages/settings/freeSwitch/FreeSwitch"),
);
const Domains = lazy(() => import("../pages/settings/freeSwitch/Domains"));
const Extension = lazy(() => import("../pages/settings/freeSwitch/Extension"));
const Gateway = lazy(() => import("../pages/settings/freeSwitch/Gateway"));
const Groups = lazy(() => import("../pages/settings/freeSwitch/Groups"));

export const settingsRoutes = [
  {
    path: "settings/communication/bulk-email/report",
    element: <EmailReport />,
  },
  {
    path: "settings/general",
    element: <GeneralTab />,
    children: [
      { path: "client-logo", element: <ClientLogo /> },
      { path: "imp-link", element: <ImpLink /> },
      { path: "tag", element: <Tag /> },
      { path: "currencies", element: <Currencies /> },
      { path: "config-settings", element: <ConfigSettings /> },
      { path: "app", element: <AppDetails /> },
      { path: "recaptcha", element: <RecaptchaDetails /> },
      { path: "", element: <ClientLogo /> },
    ],
  },
  {
    path: "settings/integration",
    element: <IntegrationTab />,
    children: [
      { path: "gsuite", element: <Gsuite /> },
      { path: "domain", element: <Domain /> },
      { path: "plesk", element: <Plesk /> },
      { path: "razorpay", element: <Razorpay /> },
      { path: "s3-config", element: <S3config /> },
      { path: "domain-config", element: <DomainTLD /> },
      { path: "", element: <Gsuite /> },
    ],
  },
  {
    path: "settings/communication",
    element: <EmailTab />,
    children: [
      { path: "email", element: <Email /> },
      { path: "template", element: <EmailTemplate /> },
      { path: "bulk-email", element: <BulkEmail /> },
      { path: "template/edit/:id", element: <EditTemplate /> },
      { path: "", element: <Email /> },
    ],
  },
  {
    path: "settings/sms",
    element: <SmsTemplate />,
  },
  {
    path: "settings/transaction-series",
    element: <TransactionSettings />,
    children: [],
  },
  {
    path: "settings/admin",
    element: <AdminList />,
    children: [],
  },

  {
    path: "settings/configuration",
    element: <ConfiguratonTab />,
    children: [
      { path: "transaction-series", element: <TransactionSettings /> },
      { path: "payment-terms", element: <PaymentTerms /> },
      { path: "manage-tax", element: <TaxList /> },
      { path: "gst-taxes", element: <GstTaxes /> },
    ],
  },
  {
    path: "settings/dns",
    element: <TemplatePage />,
  },
  {
    path: "settings/dns/templates/new",
    element: <CreateTemplate />,
  },
  {
    path: "settings/dns/templates/edit/:id",
    element: <EditTemplatedns />,
  },
  {
    path: "settings/freeSwitch",
    element: <FreeSwitchTab />,
    children: [
      { path: "load-balancer", element: <LoadBalancer /> },
      { path: "free-switch", element: <FreeSwitch /> },
      { path: "domain", element: <Domains /> },
      { path: "extension", element: <Extension /> },
      { path: "gateway", element: <Gateway /> },
      { path: "groups", element: <Groups /> },
      { path: "dial-plan", element: <DialPlan /> },
      { path: "virtual-number", element: <VirtualNumber /> },
    ],
  },

  {
    path: "settings/freeSwitch/virtual-number/:id",
    element: <VirtualNumberDetail />,
    children: [
      { path: "general", element: null },
      { path: "incoming-calls", element: null },
      { path: "outgoing-calls", element: null },
      { path: "*", element: null },
    ],
  },
  {
    path: "settings/freeSwitch/virtual-number/:id/bulk-assign",
    element: <BulkAssign />,
  },
  {
    path: "settings/freeSwitch/virtual-number/:id/flow/:flowId",
    element: <IVRFlowBuilder />,
  },
];
