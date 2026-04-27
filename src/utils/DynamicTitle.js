import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function DynamicTitle() {
    const location = useLocation();

    useEffect(() => {
        const routeTitles = {
            "/home": "Dashboard",
            "/customers": "Customers",

            //Sales
            "/sales/order": "Orders",
            "/sales/orders/create": "New Order",
            "/sales/invoices": "Invoices",
            "/sales/subscriptions": "Subscriptions",
            "/sales/credit-notes": "Credit Notes",

            // Paymaents
            "/sales/payments": "Payment Received",
            "/g-suite-transactions": "G-Suite Transactions",

            // Products
            "/pricing/domain": "Domain",
            "/pricing/g-suite": "G-Suite",
            "/pricing/tax": "Tax",
            "/pricing/hosting": "Hosting",
            "/pricing/hosting/new": "New Hosting",
            "/products/applications": "Applications",
            "/products/applications/suite": "Suites",
            "/products": "Products",

            // Reports
            "/report/total-service": "Total Service Report",
            "/report/renewal": "Renewal Report",
            "/report/g-suite": "G-Suite Report",
            "/report/domain": "Domain Report",
            "/report/hosting": "Hosting Report",
            "/report/overdue": "OverDue Report",
            "/report/purchasedProduct": "Prodct Report",

            // Purchased
            "/purchased/vendors": "Vendors",
            "/purchased/bills": "Bills",
            "/purchased/payments": "Payment Made",

            // Purchased
            "/items": "Items",
            "/items/new": "New Item",

            // Users
            "/users": "Users",
            
            // Account
            "/accountant/accounts": "Accounts",


            // Settings 
            "/settings/general": "Config",
            "/settings/general/currencies": 'Currency',
            "/settings/general/client-logo": "Client Logo",
            "/settings/general/imp-link": "Imp Link",
            "/settings/general/tag": "Tag",
            "/settings/general/app": "App",
            "/settings/general/recaptcha": "Recaptcha",

            "/settings/integration": "G-suite",
            "/settings/integration/domain": "Domain",
            "/settings/integration/plesk": "Plesk",
            "/settings/integration/razorpay": "Payment",

            "/settings/communication": "Email",
            "/settings/communication/template": "Email Template",
            "/settings/communication/bulk-email": "Bulk Email",
            "/settings/communication/template/edit": "Edit Template",

            "/settings/configuration": "Transaction Series",
            "/settings/configuration/payment-terms": "Payment Terms",
            "/settings/configuration/manage-tax": "Manage Tax",
            "/settings/configuration/gst-taxes": "GST Taxes",

        };

        const sortedRoutes = Object.keys(routeTitles).sort(
            (a, b) => b.length - a.length
        );

        const currentRoute = sortedRoutes.find((path) =>
            location.pathname.startsWith(path)
        );

        document.title = currentRoute
            ? `${routeTitles[currentRoute]} | Admin Panel`
            : "Admin Panel";

    }, [location.pathname]);

    return null;
}
