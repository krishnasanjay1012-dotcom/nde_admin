// import { useMemo } from "react";
// import { useCurrencies } from "../../../hooks/settings/currency";
// import { usePlans, useProducts } from "../../../hooks/products/products-hooks";

// export const useCustomerOptions = () => {
//   const { data } = useProducts("all");
//   const { data: currenciesResponse = {} } = useCurrencies();
//   const currencies = currenciesResponse?.data || [];
//   const allData = data?.data || [];

//   const currencyOptions = useMemo(
//     () =>
//       currencies.map((item) => ({
//         label: `${item.country} - ${item.code}`,
//         value: item.code,
//       })),
//     [currencies]
//   );

//  const productTypeMap = useMemo(() => {
//     return allData?.reduce((acc, item) => {
//       acc[item.type] = acc[item.type] || [];
//       acc[item.type].push(item._id);
//       return acc;
//     }, {});
//   }, [allData]);


  

// const customerOptions = useMemo(
//   () => [
//     {
//       label: "SKU",
//       value: "sku",
//       children: [
//         {
//           label: "App ",
//           value: "app",
//           children: [
//             { label: "New Domain", value: "new" },
//             { label: "Transfer Domain", value: "transfer" },
//             { label: "Renewal", value: "renewal" },
//           ],
//         },
//         {
//           label: "GSuite",
//           value: "gsuite",
//           children: [
//             { label: "Business Starter", value: "business_starter" },
//             { label: "Business Standard", value: "business_standard" },
//             { label: "Business Plus", value: "business_plus" },
//           ],
//         },
//         {
//           label: "Hosting",
//           value: "hosting",
//           children: [
//             { label: "Shared Hosting", value: "shared" },
//             { label: "VPS Hosting", value: "vps" },
//             { label: "Dedicated Server", value: "dedicated" },
//           ],
//         },
//         {
//           label: "Domain",
//           value: "domain",
//           children: [
//             { label: "Shared Hosting", value: "shared" },
//             { label: "VPS Hosting", value: "vps" },
//             { label: "Dedicated Server", value: "dedicated" },
//           ],
//         },
//       ],
//     },

//     {
//       label: "Subscription Status",
//       value: "subscription",
//       children: [
//         { label: "Active", value: "active" },
//         { label: "Pending", value: "pending" },
//         { label: "Trial", value: "trial" },
//         { label: "Renewed", value: "renewed" },
//         { label: "Suspended", value: "suspended" },
//         { label: "Inactive", value: "inactive" },
//         { label: "Cancelled", value: "cancelled" },
//         { label: "Expired", value: "expired" },
//       ],
//     },

//     {
//       label: "Payment Plan",
//       value: "paymentPlan",
//       children: [
//         { label: "Monthly", value: "monthly" },
//         { label: "Annual", value: "annual" },
//         { label: "Quarterly", value: "quarterly" },
//         { label: "Biannually", value: "biannually" },
//         { label: "Triannually", value: "triannually" },
//       ],
//     },

//     {
//       label: "Billing Account Region",
//       value: "billing_region",
//       children: currencyOptions,
//     },

//     {
//       label: "Renewal Date",
//       value: "renewalDays",
//       children: [
//         { label: "Tomorrow", value: "tomorrow" },
//         { label: "Next 7 days", value: "7" },
//         { label: "Next 30 days", value: "30" },
//         { label: "Next 90 days", value: "90" },
//       ],
//     },

//     { label: "All Customers", value: "all" },
//     { label: "Invited Customers", value: "invited" },
//     { label: "Active Customers", value: "active" },
//     { label: "Inactive Customers", value: "inactive" },
//     { label: "All Users", value: "all-user" },
//   ],
//   [currencyOptions]
// );

//   return customerOptions;
// };



  export const customerOptions = [
  {
    id: "aaa",
    label: "AAA",
    group: "created",
  },
  {
    id: "vip_customers",
    label: "VIP Customers",
    group: "created",
  },
    { label: "All Customers", id: "all" ,group: "public",},
    { label: "Invited Customers", id: "invited" },
    { label: "Active Customers", id: "active",group: "public", },
    { label: "Inactive Customers", id: "inactive",group: "public", },
    { label: "All Users", id: "all-user",group: "public", },
];