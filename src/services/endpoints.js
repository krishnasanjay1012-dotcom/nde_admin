export const LOGIN_URL = "/adminRoute/adminLogin";

//  Dashboard Data
export const CHART = "/dashboard/chartbar";
export const TOTAL_AMOUNT_BY_MONTH = "/dashboard/totalamountbymonth";
export const DAILY_DATA = "/dashboard/dailywise";
export const PRODUCT_DATA = "/dashboard/productwise";
export const TOTAL_DOMAIN = "/dashboard/total-domain";
export const TOTAL_CLIENTS = "/dashboard/totalclients";
export const USER_COUNT = "/dashboard/usercount";
export const ORDER_COUNT = "/dashboard/ordercount";
export const TOTAL_GSUITE = "/dashboard/total-gsuite";
export const TOTAL_HOSTING = "/dashboard/total-hosting";
export const TOTAL_PAID_INVOICE = "/dashboard/total_paid_invoice";
export const TOTAL_SALES = "/dashboard/totalsales";
export const OVERDUE_COUNT = "/dashboard/overduecount";
export const ACTIVITY_LOG = "/logs";

export const GET_ALL_DOMAINS = "/domain/alldomains";
export const UPDATE_DOMAIN_DETAILS = "/domain/domain-details";
export const DELETE_DOMAIN = "/domain/deletedomain";
export const CREATE_DOMAIN = "/domain";
export const DOMAIN_PRICING = "/domain/domainpricing/";
export const UPDATE_DOMAIN_PRICING = "/domain/domain/price";
export const DOMAIN_PRICE = "/domain/price";

/* ==================== Global Dashboard =======================*/

// Create component endpoints
export const DASHBOARD = "/dashboard";
export const KPI_MODULES = "/kpi/modules";

// Product Groups
export const GET_ALL_PRODUCT_GROUPS = "/product-group";

// Global Search
export const GLOBALSEARCH = "/miliesearch/search";

// Settings

export const CONFIG_VIEW = "/configSettings/view";
export const CONFIG_UPDATE = "/configsettings/update";

// Currency
export const CURRENCIES_VIEW = "/currency";
export const CURRENCIES_CREATE = "/currency";
export const CURRENCIES_UPDATE = "/currency";
export const CURRENCIES_DELETE = "/currency";

// Tag
export const TAGS_VIEW = "/tag";
export const TAGS_CREATE = "/tags";
export const TAGS_UPDATE = "/tags";
export const TAGS_DELETE = "/tags";

// Logo
export const LOGOS_VIEW = "/logo";
export const LOGOS_CREATE = "/logo";
export const LOGOS_UPDATE = "/logo/details";
export const LOGOS_DELETE = "/logo";

// Important Link endpoints
export const IMP_LINKS_VIEW = "/link";
export const IMP_LINKS_CREATE = "/link";
export const IMP_LINKS_UPDATE = "/link";
export const IMP_LINKS_DELETE = "/link";

// G-Suite
export const GSUITE_VIEW = "/gsuite";
export const GSUITE_CREATE = "/gsuite";
export const GSUITE_UPDATE = "/gsuite";
export const GSUITE_DELETE = "/gsuite";
export const GSUITE_SERVER_UPDATE = "/gsuite/GsuiteCredentials/update";
export const GSUITE_DEFAULT_CONFIG = "/gsuite/default";
export const GSUITE_UPDATE_CURRENCY = "/gsuite/currency";

// Resellers

export const RESELLER_VIEW = "/reseller/getreselleracc";
export const RESELLER_CREATE = "/resellerclub/createreselleracc";
export const RESELLER_UPDATE = "/resellerclub/updatereselleracc";
export const RESELLER_DELETE = "/resellerclub/deletereselleracc";
export const TLD_BASE = "/tld";

// Plesk
export const PLESK_VIEW = "/plesk/getPlusk";
export const PLESK_CREATE = "/plesk/createPlusk";
export const PLESK_UPDATE = "/plesk/updatePlesk/recupdate";
export const PLESK_DELETE = "/plesk/deletePlusk/recdelete";

// Email
export const EMAIL_VIEW = "/email/getemailconfig";
export const EMAIL_CREATE = "/email/emailconfig";
export const EMAIL_UPDATE = "/email/updateindivitualemailconfig";
export const EMAIL_DELETE = "/email/deleteindivitualemailconfig";
export const EMAIL_ENABLE = "/email/enable";
export const BULK_MAIL = "/email/bulkmail/filter";
export const EMAIL_GET_CONFIG = "/email/getemailconfig";
export const EMAIL_GROUP = "/group";
export const EMAIL_NEWSLETTER_SEND = "/email/newsletter/send";
export const EMAIL_CAMPAIGN_NAME = "/email/campaignname";
export const EMAIL_ALL_TEMPLATE = "/emailTemp/allTemplate";
export const EMAIL_UPDATE_TEMPLATE = "/emailTemp/updateTemplate";
export const EMAIL_TEMPLATE_BY_ID = "/emailTemp/templateById";
export const EMAIL_ADD_TEMPLATE = "/emailTemp/addtemplate";

// customer endpoints
export const CUSTOMER_LIST = "/client/getclientdatas";
export const CUSTOMER_DETAILS = "/client/";
export const GSUITE_BY_CLIENT = "/gsuite/gsuitedata";
export const DOMAIN_BY_CLIENT = "/reseller/getDomain";
export const PLESK_DATA_BY_CLIENT = "/plesk/pleskdata";
export const TLD_RESELLERS = "/resellers/tld";
export const PURCHASED_PRODUCTS = "/product/apps";
export const INVOICE_BY_CLIENT = "/invoice/invoice_by_client";
export const CREATE_CUSTOMER = "/admin/customer-create";
export const CLIENT_UPDATE = "/client/updateClient";
export const EMAIL_LOG = "/emaillog";
export const LOGS = "/logs";
export const PAYMENT_DETAILS = "/payment/details";
export const DELETE_CLIENT = "/client/deleteClient";
export const CLIENT_MAP_WORKSPACE = "/client/create_map_workspace";
export const RESELLERS_MIGRATE = "/resellers/migrate";
export const PLESK_MIGRATE = "/plesk/migrate";
export const GSUITE_MIGRATE = "/gsuite/migrate";
export const BULK_DELETE_CLIENT = "/client/bulk-delete-client";
export const WALLET_ADD_FUND = "/wallet/addfund";
export const PAYMENT_OPENING_BALANCE = "/payment/opening-balance";
export const WALLET_UPDATE_TRANSACTION = "/wallet/update-transaction";
export const CLIENT_NOTES = "/client/notes";
export const CUSTOMER_IMPORT_EXCEL = "/client/add-clients-excel-sheet";
export const WALLET = "/wallet/openingBalance";

// CLIENT_CUSTOM_VIEW
export const CLIENT_CUSTOM_VIEW = "/client/client-custom-view";

// Payment
export const PAYMENTS_VIEW = "/payment/getPaymentData";
export const PAYMENTS_CREATE = "/payment/addPaymentData";
export const PAYMENTS_UPDATE = "/payment/updatePaymentDataById";
export const PAYMENTS_DELETE = "/payment/deletePaymentDataById";
export const PAYMENT_TYPES = "/payment/type";

// Tax
export const TAX_VIEW = "/dashboard/auditing";
export const TAX_CREATE = "/tax/create";
export const TAX_UPDATE = "/tax/update";
export const TAX_DELETE = "/tax/delete";
export const TAX_PDF = "/invoice/download-invoice";
export const TAX_EXCEL = "/tax/download/invoice-excel";

// Tax in invoice

export const GST_TAX_CREATE_AND_LIST = "/tax/gst";

// GSuite Price
export const GSUITE_PRICE_VIEW = "/product/getallgsuite";
export const GSUITE_PRICE_CREATE = "/product/creategsuite";
export const GSUITE_PRICE_UPDATE = "/product/updategsuite";
export const GSUITE_PRICE_DELETE = "/product/deletegsuite";
export const MASTER_VIEW = "/gsuite/master";
export const PRODUCT_VIEW = "/product-group";
export const GSUITE_VIEW_ID = "/product/gsuite";

// Sales Invoice
export const INVOICE_VIEW = "/invoice/getAllinvoices";
export const INVOICE_VIEW_ID = "/invoice/getInvoiceById";
export const INVOICE_CREATE = "/invoice/manual";
export const INVOICE_UPDATE = "/invoice/manual";
export const INVOICE_DELETE = "/invoice/deleteInvoice";
export const INVOICE_BULK_DELETE = "/invoice/bulk-delete";
export const INVOICE_MAIL_DETAILS = "/invoice/default";
export const INVOICE_IMPORT_EXCEL = "/invoice/import-excel";
export const CONTACT_PERSON_CREATE = "/client/contact-person";
export const STATEMENT_PREVIEW = "/transaction";
export const SENT_INVOICE_MAIL = "/invoice/send";
export const SALESPERSON_LIST = "/adminRoute/sales-person";
export const PAYMENT_MODE_LIST = "/transaction/options/payment-modes";
export const FROM_ACC_LIST = "/transaction/options/deposit-accounts";
export const DEPOSIT_TO_LIST = "/transaction/options/ledger";
export const OVERVIEW_CURRENCY_LIST = "/currency";
export const SECTIONS_LIST = "/tax/section";
export const PAYABLE_ACCOUNT_LIST = "/transaction/options/deposit-accounts";
export const CREATE_TDS = "/tax";
export const CREATE_REFUND = "/payment/refund";
export const REFUND = "/payment/refund";
export const REFUND_BY_PAYMENT = "/payment/refund/payment";
export const CREATE_PAYMENT_MODE = "/transaction/payment-modes";
export const DELETE_PAYMENT = "/payment";
export const CREATE_WRITEOFF = "/invoice/writeoff";
export const CANCEL_WRITEOFF = "/invoice/writeoff/cancel";
export const CREATE_VOID = "/invoice/void";
export const REMOVE_VOID = "/invoice/unvoid";
export const INVOICE_SENT = "/invoice";
export const INVOICE = "/invoice/generate-link";
export const INVOICE_GENERATE_LINK = "/invoice/generate-link";

export const INVOICE_SHARE = "/invoice/generate-link";
export const INVOICE_DISABLE_LINK = "/invoice/link/disable";

// Suspension Report
export const SUSPENSION_REPORT = "/dashboard/getsuspensionreport";
export const GSUITE_SERVICE_DETAILS_CLIENT =
  "/gsuite/service/servicedetailsclient";

//Renewal Report
export const RENEWAL_DATA_BY_DATE = "/dashboard/renewaldatabydate";
export const RESELLER_SERVICE_DETAILS_CLIENT =
  "/resellers/servicedetailsclient";

// Oders
export const ORDER_GET_ALL = "/order/getAllOrders";

// Notification
export const NOTIFICATION_GET_ALL = "/notification/getAll";
export const NOTIFICATION_UPDATE = "/notification/update";

// Work Space
export const ADD_WORKSPACE = "/workspace/add_workspace";
export const WORKSPACE_LIST = "/workspace/workspace_list";
export const WORKSPACE_DETAILS = "/workspace/workspace_details";
export const WORKSPACE_UPDATE = "/workspace";
export const GET_USER_BY_WORKSPACE = "/client/get-user-by-workspace";
export const GET_CONTACT_PERSON = "/client/contact-person";

// APPS
export const APPS = "/apps";
export const APPS_LIST = "/apps";
export const APPS_PRODUCT = "/product";
export const APPS_PRICE = "/apps/price";
export const APPS_UPDATE = "/apps";
export const APPS_PLAN = "/apps/plan";
export const ADD_EDIT_PLAN = "/apps/plan";
export const APPS_PLAN_DELETE = "/apps/product";
export const APPS_DELETE = "/apps/product/bulk-delete";

// Subscription
export const SUBSCRIPTION_USER = "/subcription/user";
export const SUBSCRIPTION = "/subscription";

// Product by Group
export const PRODUCT_BY_GROUP = "/product/productbygroup";
export const GET_ALL_PRODUCTS = "/product/getAllProducts";
export const CART_ADMIN = "/cart/admin";
export const REMOVE_CLIENT_CART = "/cart/client/remove";
export const MAKE_ORDER = "/payment/makeorder";
export const WALLET_BALANCE = "/wallet/balance";
export const DOMAIN_CHECK = "/resellerclub/domaincheck";
export const CART_UPDATE = "/cart/update";
export const ORDER_DELETE = "/order/deleteOrder";
export const ORDER_ADMIN_ORDER = "/order/admin_order";

// Suite
export const SUITE_ADD = "/suite/add";
export const SUITE_DELETE = "/suite/delete";
export const SUITE_GET_ALL = "/suite/get-all";
export const SUITE_UPDATE = "/suite/update";
export const SUITE_PLAN_DELETE = "/suite/plan";
export const SUITE_PLAN_CREATE = "/suite/plan/add";
export const SUITE_PLAN_BY_ID = "/suite/plan";
export const SUITE_PLAN_UPDATE = "/suite/plan";

// Update Admin Password
export const ADMIN_UPDATE_PASSWORD = "/client/admin/update-password";

// Reports
export const GSUITE_PRODUCT_LIST = "/dashboard/gsuiteproductlist";
export const DOMAIN_PRODUCT_LIST = "/dashboard/domainproductlist";
export const PLESK_PRODUCT_LIST = "/dashboard/pleskproductlist";
export const APPS_PRODUCT_LIST = "/dashboard/appsproductlist";

// App List
export const APP_DETAILS = "/appDetails";

// renewal
export const DOMAIN_RENEWAL_PRICE_ADMIN = "/domain/renewal_price_admin";
export const PRODUCT_GSUITE_PAYMENT = "/product/gsuite/payment";
export const PRODUCT_PLESK_RENEWAL = "/product/plesk/renewal";

// Payment Renewal Endpoints
export const PAYMENT_GSUITE_RENEWAL = "/payment/gsuite/renewal";
export const PAYMENT_PLESK_RENEWAL = "/payment/plesk/renewal";
export const RAZORPAY_DOMAIN_RENEWAL = "/payment/razorpay/domain-renewal";

// Hosting Price
export const PRODUCT_GET_ALL = "/product/getAllProducts";
export const PLESK_GET = "/plesk/getPlusk";
export const PRODUCT_DELETE = "/product/deleteProduct";

// GSuite
export const GSUITE_IMPORT_EXCEL = "/gsuite/transactions/import-excel";
export const GSUITE_TRANSACTIONS = "/gsuite/transactions";
export const GSUITE_BULK_UPDATE = "/gsuite/transactions/bulk-update";
export const GSUITE_TRANSACTION_BY_DOMAIN = "/gsuite/transactions/domain";

// Admin
export const ADMIN_LIST = "/adminRoute/getadminlist";
export const ADMIN_BY_ID = "/adminRoute";
export const UPDATE_ADMIN = "/adminRoute/updateAdmin";
export const ADMIN_SIGNUP = "/adminRoute/adminSignUp";
export const DELETE_ADMIN = "/adminRoute/deleteAdmin";
export const ADMIN_CUSTOMERS = "/adminRoute/admin-customers";

// recaptcha
export const RECAPTCHA = "/recaptcha";

// OAUTH
export const GSUITE_OAUTH_ACTIVE_CONFIG = "/gsuite/oauth/config/active";
export const GSUITE_CONFIGURE_GOOGLE = "/gsuite/configure-google";

// Products
export const PRODUCT = "/product";
export const TAX = "/tax";
export const TAXBYID = "/tax";
export const PLAN_BASE = "/plan";
// export const PLAN_PRICING = "/pricing/plan";
export const PLAN_PRICING = "/plan/currencies";
export const PRODUCT_STATUS = "/product/status";
export const PLAN_PRICING_CURRENCY = "/plan/currency";
export const PLAN_BILLING_CYCLE = "/plan/billingcycle";
export const BILLING_CYCLE = "/plan/billingcycles";
export const PLAN_PRICE_DISCOUNT = "/plan/price/discount";
export const PLAN_UPLOAD_PROFILE = "/plan/upload-profile";
export const PLAN_REMOVE_PROFILE = "/plan/remove-profile";
export const PLAN_CLONE = "/plan/clone";
export const PLAN_CONFIG = "/plan/config";
export const PRODUCT_EXIST = "/product/exists";
export const PRODUCT_SUGGESTION = "/product/suggestion";

// S3_CONFIG
export const S3_CONFIG = "/s3-config";

// Customer OverView Details

export const USER_OUTSTANDING_PAYMENTS = "/invoice/pending";
export const SUBSCRIPTION_BY_USER = "/subscription/user";
export const RENEWAL_DASHBOARD = "/dashboard/renewaldatabydate";

//PAYMENT_TERM
export const PAYMENT_TERM = "/payment-term";

// Associate Customer
export const MOVE_CUSTOMERS_TO_ADMIN = "/adminRoute/moveCustomers";

// Payment Terms

export const PAYMENT_TERM_INVOICE = "/payment-term";
// Customer filter
export const FILTER_OPTIONS_CUSTOMER = "/custom-views/filter-options";
export const CUSTOM_VIEW_FAVORITE = "/custom-views";

// Custom View

export const AVAILABLE_FIELDS = "/custom-views/available-fields";
export const FILTER_FIELDS = "/custom-views/filters/fields";
export const CUSTOM_VIEWS_CUSTOMER = "/custom-views";

export const CUSTOM_VIEWS = "/custom-views";

// Doamin TLD
export const TLD = "/tld";

// Payment Recived

export const PAYMENT = "/payment";
export const PAYMENT_MODES = "/transaction/options/payment-modes";
export const DEPOSIT_ACCOUNTS = "/transaction/options/deposit-accounts";
export const LEDGER_ACCOUNTS = "/transaction/options/ledger";

export const PURCHASED_PRODUCT_LIST = "/dashboard/purchase-product-list";

export const TRANSACTION_DEPOSIT_LIST = "/transaction/options/deposit-accounts";
export const INVOICE_OVERVIEW_LIST = "/invoice/overview-invoice";
export const STATEMENT_DETAILS = "/payment/statement";
export const UNPAID_INVOICE = "/invoice/unpaid";
export const PAYMENT_VOID = "/payment/void";
export const PAYMENT_UNVOID = "/payment/unvoid";
export const PAYMENT_OPEN = "/payment/status/paid";

// Transaction Series
export const GET_COUNTERS = "/count-settings";
export const UPDATE_COUNTERS = "/count-settings/bulk-update";
export const GET_INVOICE_COUNTER = "/count-settings";

export const VIEW_PREFERENCE = "/adminRoute/view-preference";

// Vendors

export const VENDORS = "/vendor";
export const VENDORS_NOTES = "/vendor/notes";

export const ITEMS = "/vendor-item";
export const ITEMS_NOTES = "/items/notes";
export const TAX_HSN_SEARCH = "/tax/hsncode/search";

// Bills

export const BILLS = "/vendor-bill";
export const BILL_PAYMENTS = "/bill-payment";
export const VENDOR_BILL_VOID = "/vendor-bill/void";
export const VENDOR_BILL_UNVOID = "/vendor-bill/unvoid";
export const BILL_PAYMENTS_BY_BILL = "/bill-payment/bill";
export const BILL_CALENDAR_VIEW = "/vendor-bill/calendarview";

export const VENDOR_BILL_OPEN = "/vendor-bill";
export const VENDOR_BILL_UNPAID = "/vendor-bill/unpaid";

// Accountant

export const ACCOUNTS = "/accounting/accounts";
export const ACCOUNTS_TREE = "/accounting/accounts/tree";

// dns
export const ZONE = "/zones";
export const PREVIEW = "/preview";
export const SWITCH_TEMPLATE = "/switch-template";
export const SYNC_TEMPLATE = "/sync-template";


export const PRESET = "/presets";
export const RECORDS = "/records";
export const FILTER_RECORDS = "/records-filter";
export const BULK = "/bulk";
export const TEMPLATES = "/templates";
export const TOGGLE = "/toggle";
export const TEMP_VALUE = "/temp-value";
export const DOMAIN_DETAILS = "/domain-details";
//FreeSwitch
export const FREESWITCH = "/freeswitch_server/get/freeswitch";
export const FREESWITCH_CONNECT = "/freeswitch_server/connect_freeswitch";
export const FREESWITCH_UPDATE = "/freeswitch_server/update/";
export const FREESWITCH_DELETE = "/freeswitch_server/delete/";

// FreeSwitch Domain
export const FREESWITCH_DOMAIN_ADD = "/domain/add";
export const FREESWITCH_DOMAIN_GET = "/domain/get";
export const FREESWITCH_DOMAIN_SINGLE = "/domain/singleget/";
export const FREESWITCH_DOMAIN_UPDATE = "/domain/update/";
export const FREESWITCH_DOMAIN_DELETE = "/domain/delete/";
export const GET_WORKSPACE_DOMAINS = "/domain/get_workspace_domains/";
export const FREESWITCH_DOMAIN_CHECK = "/domain/check";
export const EXTENSION_ADD = "/extension/add";
export const EXTENSION_GET = "/extension/get";
export const EXTENSION_UPDATE = "/extension/update/";
export const EXTENSION_DELETE = "/extension/delete/";

export const FREESWITCH_GATEWAY_ADD = "/gateway/add";
export const FREESWITCH_GATEWAY_GET = "/gateway/get";
export const FREESWITCH_GATEWAY_UPDATE = "/gateway/update/";
export const FREESWITCH_GATEWAY_DELETE = "/gateway/delete/";
export const ACCOUNT_LEDGER = "/accounting/accounts";
export const JOURNAL_ITEM = "/accounting/journal/item";

// FreeSwitch Groups
export const FREESWITCH_GROUP_ADD = "/group/add";
export const FREESWITCH_GROUP_GET = "/group/get";
export const FREESWITCH_GROUP_UPDATE = "/group/update/";
export const FREESWITCH_GROUP_DELETE = "/group/delete/";


export const GET_WORKSPACE_USERS_DOMAIN = "/group/get/:workspaceid";
export const GET_DOMAIN_USERS = "/group/get/:workspaceid/domain/:domainid";

export const CALLGROUP_ADD = "/callgroup/add_call_group";
export const CALLGROUP_GET = "/callgroup/get_call_group";
export const CALLGROUP_UPDATE = "/callgroup/update_call_group/";
export const CALLGROUP_DELETE = "/callgroup/delete_call_group/"

export const DIALPLAN_DESTINATION_ADD = "/destination/destination_add";
export const DIALPLAN_DESTINATION_GET = "/destination/destination_get";
export const DIALPLAN_DESTINATION_UPDATE = "/destination/destination_update/";
export const DIALPLAN_DESTINATION_DELETE = "/destination/destination_delete/";

//Payment Made
export const PAYMENT_MADE = "/payment-made";
export const ADDRESS = "/address";

// SMS
export const SMS_CONFIG_VIEW = "/sms/config";
export const SMS_CONFIG_CREATE = "/sms/config";
export const SMS_CONFIG_UPDATE = "/sms/config";
export const SMS_CONFIG_DELETE = "/sms/config";
export const SMS_CONFIG_ENABLE = "/sms/config/enable";
export const SMS_TEMPLATE_ALL = "/sms/template";
export const SMS_TEMPLATE_BY_ID = "/sms/template";
export const SMS_TEMPLATE_CREATE = "/sms/template";
export const SMS_TEMPLATE_UPDATE = "/sms/template";
export const SMS_TEMPLATE_DELETE = "/sms/template";
