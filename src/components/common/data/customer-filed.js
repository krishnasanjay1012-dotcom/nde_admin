export const getCustomerFields = (groupOptions = []) => [
  {
    name: "customer_type",
    label: "Customer Type",
    type: "radio",
    showInfo: true,
    options: [
      { value: "business", label: "Business", default: true },
      { value: "individual", label: "Individual" },
    ],
  },
  {
    type: "group",
    label: "Primary Contact",
    showInfo: true,
    isRedlabel: true,
    fields: [
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
    name: "password",
    label: "Password",
    type: "password",
    showInfo: true,
    isRedlabel: true,
    placeholder: "Password",
  },
  {
    name: "userType",
    label: "User Type",
    type: "select",
    showInfo: true,
    isRedlabel: true,
    placeholder: "Select User Type",
    options: groupOptions
  },
];