export const VENDOR_BASIC_FIELDS = [
    {
        type: "group",
        label: "Primary Contact",
        showInfo: true,
        fields: [
            {
                name: "salutation",
                type: "select",
                placeholder: "Salutation",
                options: [
                    { label: "Mr.", value: "Mr" },
                    { label: "Ms.", value: "Ms" },
                    { label: "Mrs.", value: "Mrs" },
                ],
            },
            {
                name: "firstName",
                type: "text",
                placeholder: "First Name",
            },
            {
                name: "lastName",
                type: "text",
                placeholder: "Last Name",
            },
        ],
    },
    {
        name: "companyName",
        label: "Company Name",
        placeholder: "Company Name",
        type: "text",
    },
    {
        name: "displayName",
        label: "Display Name",
        type: "select",
        isRedlabel: true,
        showInfo: true,
        placeholder: "Select or type to add",
        options: [{ label: "Mr", value: "Mr" }],
    },
    {
        name: "email",
        label: "Email Address",
        type: "email",
        showInfo: true,
        placeholder: "Email Address",
    },
    {
        type: "phoneGroup",
        label: "Phone",
        showInfo: true,
        fields: [
            {
                name: "workPhone",
                placeholder: "Work Phone",
                type: "phone",
            },
            {
                name: "mobile",
                placeholder: "Mobile",
                type: "phone",
            },
        ],
    },
    {
        name: "vendorLanguage",
        label: "Vendor Language",
        type: "select",
        showInfo: true,
        placeholder: "English",
        options: [
            { label: "English", value: "en" },
            { label: "Hindi", value: "hi" },
            { label: "Japanese", value: "ja" }
        ],
    },
];

export const OtherDetailsFields = [
    {
        name: "pan", type: "text", label: "PAN", placeholder: "PAN NO", showInfo: true,
    },
    {
        name: "msme Registered", type: "checkbox", label: "MSME Registered?", showInfo: true, textlabel: "This vendor is MSME registered",
    },
    {
        name: "currency", type: "select", label: "Currency",
        options: [
            { label: "Account Payables", value: 1 },
        ],
    },
    {
        name: "accountPayable", type: "select", label: "Account Payable",
        showInfo: true,
        options: [
            { label: "Account Payables", value: 1 },
        ],
    },
    {
        name: "openingBalance", type: "text", label: "Opening Balance", isStarticon: true,
    },
    {
        name: "paymentTerms", type: "select", label: "Payment Terms", showInfo: true,
        options: [
            { label: "Net 15", value: 1 },
        ],
    },
    {
        name: "TDS", type: "select", label: "TDS",
        options: [
            { label: "Net 15", value: 1 },
        ],
    },
    {
        name: "enablePort", type: "checkbox", label: "Enable Portal?", showInfo: true, textlabel: "Allow portal access for this vendor",
    }, {
        name: "documents", type: "file", label: "Documents",
        textlabel: "You can upload a maximum of 10 files, 10MB each",
    },
    {
        name: "websiteURL", type: "text", label: "Website URL", placeholder: "ex: www.zyklr.com", startAdornmentType: "website",
    },
    {
        name: "department", type: "text", label: "Department",
    },
    {
        name: "designation", type: "text", label: "Designation",
    },
    {
        name: "x", type: "text", label: "X", placeholder: "X handle or link", startAdornmentType: "x",
    },
    {
        name: "skype", type: "text", label: "Skype Name/Number", placeholder: "Skype ID or number", startAdornmentType: "skype",
    },
    {
        name: "facebook", type: "text", label: "Facebook", placeholder: "Facebook profile/link", startAdornmentType: "facebook",
    },
]

export const billingAddressFields = [
  { name: "billing.attention", label: "Attention", type: "text" },
  { name: "billing.country", label: "Country/Region", type: "select" },
  { name: "billing.address1", label: "Address", type: "textarea", placeholder: "Street 1" },
  { name: "billing.address2", type: "textarea", placeholder: "Street 2" },
  { name: "billing.city", label: "City", type: "text" },
  { name: "billing.state", label: "State", type: "select" },
  { name: "billing.pincode", label: "Pin Code", type: "text" },
  { name: "billing.phone", label: "Phone", type: "phone" },
  { name: "billing.fax", label: "Fax Number", type: "text" },
];

export const shippingAddressFields = [
  { name: "shipping.attention", label: "Attention", type: "text" },
  { name: "shipping.country", label: "Country/Region", type: "select" },
  { name: "shipping.address1", label: "Address", type: "textarea", placeholder: "Street 1" },
  { name: "shipping.address2", type: "textarea", placeholder: "Street 2" },
  { name: "shipping.city", label: "City", type: "text" },
  { name: "shipping.state", label: "State", type: "select" },
  { name: "shipping.pincode", label: "Pin Code", type: "text" },
  { name: "shipping.phone", label: "Phone", type: "phone" },
  { name: "shipping.fax", label: "Fax Number", type: "text" },
];
