export const getVendorFields = () => [
    {
        type: "group",
        label: "Primary Contact",
        showInfo: true,
        isRedlabel: true,
        fields: [
            // {
            //     name: "customer_type",
            //     label: "Customer Type",
            //     type: "select",
            //     showInfo: true,
            //     options: [
            //         { label: "Mr.", value: "Mr", },
            //         { label: "Ms.", value: "Ms" },
            //         { label: "Mrs.", value: "Mrs" },
            //         { label: "Miss", value: "Miss" },
            //         { label: "Dr", value: "Dr" },
            //     ],
            // },
            {
                name: "first_name",
                type: "text",
                placeholder: "First Name",
                flex: 3,
            },
            {
                name: "last_name",
                type: "text",
                placeholder: "Last Name",
                flex: 2,
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
        name: "email",
        label: "Email Address",
        type: "email",
        showInfo: true,
        isRedlabel: true,
        placeholder: "Email Address",
    },
    {
        name: "phone_number",
        label: "Mobile Number",
        placeholder: "Mobile Number",
        type: "phone",
        isRedlabel: true,
        showInfo: true,
    },
    {
        name: "vendor_language",
        label: "Vendor Language",
        type: "select",
        showInfo: true,
    }
];